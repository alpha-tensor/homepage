/**
 * Edge worker for alphatensor.com.
 *
 * Two jobs, and deliberately nothing else:
 *   1. Serve the static marketing site from the assets binding.
 *   2. Proxy the public lab API same-origin to the existing FastAPI host.
 *
 * There is no session, no state, and no secret here. The API token, database,
 * and inference plane all live behind the existing tunnel host, which this
 * worker reaches over the public internet exactly as a browser would. That
 * keeps the site's blast radius to "can serve files and forward a request".
 *
 * Why a worker at all: the origin it replaces was a `vite preview` container,
 * which cannot proxy a path and which answers every unknown URL with the
 * homepage and a 200. Static assets with `not_found_handling: "404-page"` fix
 * that at the platform, and `run_worker_first` on the API prefix lets one
 * same-origin worker serve both, so the browser never sees a second origin and
 * no CORS surface is added.
 */

const API_PREFIX = "/api/public/v1";
const API_ORIGIN = "https://padillaapi.alphatensor.com";

interface Env {
	ASSETS: { fetch(request: Request): Promise<Response> };
}

/**
 * Whether a path belongs to the public lab API.
 *
 * @param pathname Request path, without query string.
 * @returns True for the API prefix itself and anything beneath it.
 */
export function isLabApiPath(pathname: string): boolean {
	return pathname === API_PREFIX || pathname.startsWith(`${API_PREFIX}/`);
}

/**
 * Rewrite an incoming request onto the upstream API host.
 *
 * @param request The original browser request.
 * @returns A request aimed at the upstream, with the path and query preserved.
 */
function toUpstreamRequest(request: Request): Request {
	const url = new URL(request.url);
	const target = new URL(`${url.pathname}${url.search}`, API_ORIGIN);

	const headers = new Headers(request.headers);
	// Drop the inbound host so the upstream host is used for routing and SNI.
	headers.delete("host");
	// Keep the original host visible to the API for logging.
	headers.set("x-forwarded-host", url.host);

	const bodyAllowed = request.method !== "GET" && request.method !== "HEAD";

	return new Request(target.toString(), {
		method: request.method,
		headers,
		body: bodyAllowed ? request.body : undefined,
		redirect: "manual",
	});
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (!isLabApiPath(url.pathname)) {
			return env.ASSETS.fetch(request);
		}

		const upstream = await fetch(toUpstreamRequest(request));

		const headers = new Headers(upstream.headers);
		// The runtime decodes the body but can leave these headers behind, and a
		// stale encoding or a wrong length breaks the client. Both are recomputed
		// from the streamed body instead.
		headers.delete("content-encoding");
		headers.delete("content-length");

		// Pass the body through as a stream. Reading it would buffer the preview
		// event stream, which collapses a progressive parse into one late blob.
		return new Response(upstream.body, {
			status: upstream.status,
			statusText: upstream.statusText,
			headers,
		});
	},
};
