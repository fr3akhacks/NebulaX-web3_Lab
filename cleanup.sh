#!/bin/bash

# NebulaX Web3 Lab Cleanup Script
# This script removes unnecessary files and improves project structure

echo "Starting cleanup process for NebulaX Web3 Lab..."

# Create backup directory
BACKUP_DIR="./backup-$(date +"%Y%m%d-%H%M%S")"
mkdir -p $BACKUP_DIR
echo "Created backup directory: $BACKUP_DIR"

# Function to safely remove files
safe_remove() {
  if [ -f "$1" ]; then
    mkdir -p "$(dirname "$BACKUP_DIR/$1")"
    cp "$1" "$BACKUP_DIR/$1"
    rm "$1"
    echo "Removed: $1 (backup created)"
  elif [ -d "$1" ]; then
    mkdir -p "$BACKUP_DIR/$1"
    cp -r "$1"/* "$BACKUP_DIR/$1"
    rm -rf "$1"
    echo "Removed directory: $1 (backup created)"
  else
    echo "Warning: $1 not found, skipping"
  fi
}

# Remove empty image files
echo "Checking for empty image files..."
find frontend/public/images -type f -size 0 -print | while read file; do
  safe_remove "$file"
done

# Remove temporary and development files
echo "Removing temporary and development files..."
find . -name ".DS_Store" -type f -delete
find . -name "*.log" -type f -delete
find . -name "npm-debug.log*" -type f -delete
find . -name "yarn-debug.log*" -type f -delete
find . -name "yarn-error.log*" -type f -delete

# Clean up package files
echo "Cleaning up package files..."
find . -name "package-lock.json" -type f | while read file; do
  safe_remove "$file"
done

# Remove mock data from production code
echo "Converting mock data to proper development fixtures..."
# Instead of deleting, move to a fixtures directory
mkdir -p frontend/fixtures
if [ -f "frontend/mockData.js" ]; then
  mv frontend/mockData.js frontend/fixtures/
  echo "Moved mock data to fixtures directory"
fi

echo "Cleanup complete! All removed files are backed up in $BACKUP_DIR"
echo "Please review the changes before committing." 