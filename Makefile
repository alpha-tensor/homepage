.DEFAULT_GOAL := help

.PHONY: help deploy docker-up docker-down docker-build docker-logs docker-nuke check

help: ## Show available targets (safe default; never deploys)
	@echo "AlphaTensor website targets"
	@echo ""
	@echo "  make check        lint and type-check the source (no build output)"
	@echo "  make build        full production build: tsc + vite build + static prerender"
	@echo "  make deploy       deploy a clean, committed tree to production (explicit, needs approval)"
	@echo ""
	@echo "Docker helpers (used by scripts/deploy.sh on the remote server):"
	@echo "  make docker-up / docker-down / docker-build / docker-logs / docker-nuke"

check:
	@npm run lint

build:
	@npm run build

# Deploy the application to the remote server. Refuses to run on a dirty tree.
deploy:
	@bash scripts/deploy.sh

# Docker helper targets
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
