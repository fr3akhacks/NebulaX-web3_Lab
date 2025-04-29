#!/bin/bash

# NebulaX Stop Script
echo "┌──────────────────────────────────────────┐"
echo "│      Stopping NebulaX Web3/Web2 Lab      │"
echo "└──────────────────────────────────────────┘"

# Find and kill processes on specific ports
echo "Stopping all services..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "No process found on port 3000"
lsof -ti:4000 | xargs kill -9 2>/dev/null || echo "No process found on port 4000"

# Alternative process killing by name
echo "Stopping any remaining processes..."
pkill -f "node.*next" 2>/dev/null || echo "Frontend process not found"
pkill -f "node.*server.js" 2>/dev/null || echo "Backend process not found"

# Clean up log files
echo "Cleaning up log files..."
rm -f frontend.log backend.log

# Check if any processes are still running
if lsof -ti:3000 || lsof -ti:4000; then
    echo "WARNING: Some processes could not be stopped. You may need to manually kill them."
else
    echo "All processes successfully stopped."
fi

echo ""
echo "┌──────────────────────────────────────────┐"
echo "│      NebulaX successfully stopped!       │"
echo "└──────────────────────────────────────────┘"
echo ""
echo "You can restart the application by running ./setup.sh"
echo "" 