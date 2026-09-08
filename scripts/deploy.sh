#!/bin/bash
set -euo pipefail

# This script deploys the application to a remote server using rsync.
# It excludes common development and cache directories.

# --- Load .env ---
if [ -f .env ]; then
  set -a
  source .env
  set +a
else
  echo "⚠️  No .env file found. Proceeding with environment variables only."
fi

echo "--- Deploying to Production ---"

# --- Preflight ---
# Deployment pushes the working tree to a live server. Refuse to run when the
# tree is dirty so a release is always traceable to a committed source.
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Refusing to deploy: working tree has uncommitted or staged changes." >&2
  echo "Commit or stash the changes first, then run make deploy again." >&2
  exit 1
fi

# --- Configuration ---
REMOTE_USER="root"
REMOTE_HOST="100.74.30.1"
# Destination directory on the remote server.
# This will be created in the home directory of the REMOTE_USER.
DEST_DIR="www"
# Source directory (current directory)
SOURCE_DIR="."

# --- Script ---
# Construct the full remote path
REMOTE_PATH="/${REMOTE_USER}/${DEST_DIR}"

echo "Deploying website to ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}"

# Create the destination directory on the remote server via SSH.
# The -p flag ensures it doesn't error if the directory already exists.
echo "Ensuring destination directory exists on remote server..."
ssh "${REMOTE_USER}@${REMOTE_HOST}" "mkdir -p ${REMOTE_PATH}"

# Use rsync to synchronize the files.
# -a: archive mode (preserves permissions, ownership, etc.)
# -v: verbose (shows which files are being transferred)
# -z: compresses data to speed up the transfer
# --delete: deletes files on the remote server that don't exist locally
echo "Syncing files..."
rsync -avz --delete --itemize-changes\
  --exclude=".git" \
  --exclude="__pycache__" \
  --exclude="*.pyc" \
  --exclude=".venv" \
  --exclude="venv" \
  --exclude=".env" \
  --exclude="node_modules" \
  --exclude=".next" \
  --exclude="dist" \
  --exclude="data" \
  "${SOURCE_DIR}/" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/"

echo "Rebuilding and restarting services on remote server..."
ssh "${REMOTE_USER}@${REMOTE_HOST}" "cd ${REMOTE_PATH} && make docker-down && make docker-build && make docker-up"

echo "✅ Deployment complete."
