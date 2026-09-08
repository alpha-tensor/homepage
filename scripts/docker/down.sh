#!/bin/bash
set -euo pipefail
echo "--- Stopping services (keeping data) ---"
docker compose down
echo "done"
