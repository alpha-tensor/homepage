#!/bin/bash
set -euo pipefail
echo "--- Pulling and building ---"
docker compose pull
docker compose build --pull --progress=plain
echo "done"
