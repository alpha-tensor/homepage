#!/bin/bash
set -euo pipefail
docker compose logs -f --since=10m
