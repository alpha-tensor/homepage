.DEFAULT_GOAL := help

.PHONY: help check test typecheck build dev deploy deploy-dry-run cf-whoami docker-up docker-down docker-build docker-logs docker-nuke

help: ## Show available targets (safe default; never deploys)
	@echo "AlphaTensor website targets"
	@echo ""
	@echo "  make check            lint, type-check, and test the source (no build output)"
	@echo "  make test             run the consent bootstrap tests (no dependencies)"
	@echo "  make build            full production build (tsc + vite build + prerender)"
	@echo "  make dev              run the worker locally with wrangler dev"
	@echo "  make deploy-dry-run   build and validate the worker bundle (no upload)"
	@echo "  make deploy           release the worker to production (explicit, needs approval)"
	@echo "  make cf-whoami        show the Cloudflare account wrangler is using"
	@echo ""
	@echo "Legacy container path. This was the origin before the worker and stays"
	@echo "available as the rollback target until the worker cutover is verified:"
	@echo "  make docker-up / docker-down / docker-build / docker-logs / docker-nuke"

check:
	@npm run lint
	@npm run typecheck
	@npm test

test:
	@npm test

typecheck:
	@npm run typecheck

build:
	@npm run build

# Faithful local check: serves dist through the worker, so route handling, the
# 404 document, and the API proxy behave as they will in production.
dev:
	@npx wrangler dev

# Validate the release without uploading it.
deploy-dry-run:
	@bash scripts/deploy.sh --dry-run

# Release the worker to production. Refuses a dirty tree.
deploy:
	@bash scripts/deploy.sh

cf-whoami:
	@npx wrangler whoami

# Docker helper targets (legacy container origin)
docker-up:
	@bash scripts/docker/up.sh

docker-down:
	@bash scripts/docker/down.sh

docker-build:
	@bash scripts/docker/build.sh

docker-logs:
	@bash scripts/docker/logs.sh

docker-nuke:
	@bash scripts/docker/nuke.sh
