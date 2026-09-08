#!/bin/bash
set -euo pipefail

# This script starts all services defined in docker-compose.yml in detached mode.

set -euo pipefail
echo "--- Bringing up services ---"
docker compose up -d
docker compose ps
