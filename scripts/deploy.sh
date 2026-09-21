#!/bin/bash
set -euo pipefail

# Release the marketing site worker.
#
# This replaces the previous Docker path. That one stopped the live service
# before rebuilding it, had no rollback, and its dirty-tree check ignored
# untracked files. A release here is traceable to a commit, and a failure leaves
# the live worker untouched.
#
# Usage:
#   scripts/deploy.sh [--dry-run]
#
# Requires CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID, from the environment
# or from .env. Scope the token to Workers Scripts:Edit for this account only.

DRY_RUN=0
for arg in "$@"; do
	case "$arg" in
	--dry-run) DRY_RUN=1 ;;
	*)
		echo "unknown argument: $arg" >&2
		exit 2
		;;
	esac
done

# Capture the invoking environment first, so an exported value wins over .env.
ENV_API_TOKEN="${CLOUDFLARE_API_TOKEN:-}"
ENV_ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-}"

if [ -f .env ]; then
	set -a
	# shellcheck disable=SC1091
	. ./.env
	set +a
fi

if [ -n "$ENV_API_TOKEN" ]; then
	CLOUDFLARE_API_TOKEN="$ENV_API_TOKEN"
fi
if [ -n "$ENV_ACCOUNT_ID" ]; then
	CLOUDFLARE_ACCOUNT_ID="$ENV_ACCOUNT_ID"
fi

if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
	echo "Refusing to release: CLOUDFLARE_API_TOKEN is not set." >&2
	echo "Export it, or put it in .env. Scope it to Workers Scripts:Edit." >&2
	exit 1
fi

if [ -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]; then
	echo "Refusing to release: CLOUDFLARE_ACCOUNT_ID is not set." >&2
	exit 1
fi

# Refuse anything that is not exactly a commit. `--untracked-files=all` is the
# flag the previous script was missing: an untracked file still changes the
# build, so with one present the release is not traceable to a commit.
if [ -n "$(git status --porcelain --untracked-files=all)" ]; then
	echo "Refusing to release: working tree is not clean." >&2
	git status --short --untracked-files=all >&2
	echo "Commit or stash the changes first, then run this again." >&2
	exit 1
fi

SHA="$(git rev-parse --short HEAD)"
echo "Releasing ${SHA} on $(git rev-parse --abbrev-ref HEAD)"

echo "Installing dependencies..."
npm ci

echo "Building..."
npm run build

# The build must produce every published document. A missing one would ship a
# site that 404s its own privacy page, so fail before uploading.
for artefact in dist/index.html dist/privacy.html dist/404.html dist/assets; do
	if [ ! -e "$artefact" ]; then
		echo "Build did not produce ${artefact}; refusing to release." >&2
		exit 1
	fi
done

# The SSR bundle is build-time only. If it lands in the published directory it
# becomes a public asset, so treat it as a build failure rather than a warning.
if [ -d dist/ssr ]; then
	echo "dist/ssr exists; the SSR bundle must not be published as an asset." >&2
	exit 1
fi

if [ "$DRY_RUN" -eq 1 ]; then
	echo "Dry run: validating the worker bundle without uploading."
	npx wrangler deploy --dry-run --outdir .wrangler-dry-run
	echo "Dry run complete. The live worker was not touched."
	exit 0
fi

npx wrangler deploy

echo "Released ${SHA}."
echo "Verify the served documents:"
echo "  curl -s -o /dev/null -w '%{http_code}\\n' https://alphatensor.com/privacy"
echo "  curl -s -o /dev/null -w '%{http_code}\\n' https://alphatensor.com/zzz  # expect 404"
