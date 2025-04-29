#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print banner
echo -e "${BLUE}"
echo -e "███╗   ██╗███████╗██████╗ ██╗   ██╗██╗      █████╗ ██╗  ██╗"
echo -e "████╗  ██║██╔════╝██╔══██╗██║   ██║██║     ██╔══██╗╚██╗██╔╝"
echo -e "██╔██╗ ██║█████╗  ██████╔╝██║   ██║██║     ███████║ ╚███╔╝ "
echo -e "██║╚██╗██║██╔══╝  ██╔══██╗██║   ██║██║     ██╔══██║ ██╔██╗ "
echo -e "██║ ╚████║███████╗██████╔╝╚██████╔╝███████╗██║  ██║██╔╝ ██╗"
echo -e "╚═╝  ╚═══╝╚══════╝╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝"
echo -e "${GREEN}Web3 Lab with Intentional Security Vulnerabilities${NC}\n"

# Warning message
echo -e "${RED}WARNING: This application contains intentional security vulnerabilities for educational purposes.${NC}"
echo -e "${RED}DO NOT use real credentials or deploy to production.${NC}\n"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if npm is installed
if ! command_exists npm; then
    echo -e "${RED}Error: npm is not installed. Please install Node.js and npm first.${NC}"
    exit 1
fi

# Start backend server
echo -e "${GREEN}Starting backend server...${NC}"
cd backend
npm install &> /dev/null
echo "Installing backend dependencies..."
npm run dev &
BACKEND_PID=$!
echo -e "${GREEN}Backend server started on http://localhost:3001${NC}"

# Wait for backend to initialize
sleep 3

# Start frontend server
echo -e "${GREEN}Starting frontend server...${NC}"
cd ../frontend
npm install &> /dev/null
echo "Installing frontend dependencies..."
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}Frontend server started on http://localhost:3000${NC}"

# Instructions
echo -e "\n${BLUE}=== Instructions ===${NC}"
echo -e "1. Open your browser and navigate to ${GREEN}http://localhost:3000${NC}"
echo -e "2. Explore the application, including the NFT Notes and Login pages"
echo -e "3. Check out the SQL injection guide at ${GREEN}docs/sql_injection_guide.md${NC}"
echo -e "4. Press Ctrl+C to stop all servers\n"

# Handle exit
function cleanup {
    echo -e "\n${GREEN}Shutting down servers...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup INT

# Keep script running
wait