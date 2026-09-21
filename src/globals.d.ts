/**
 * Globals stamped into the HTML by the build-time prerenderer.
 *
 * Each prerendered document declares the route it was rendered for, so the
 * client hydrates the same tree the server produced. Without it React would
 * render the home route into a privacy or 404 document and then correct itself,
 * which is a hydration mismatch and a visible flash of the wrong page.
 */
declare global {
	interface Window {
		__AT_BOOT_ROUTE__?: string;
	}
}

export {};
