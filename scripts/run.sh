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

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

# Check Node.js version
if ! command_exists node; then
    echo -e "${RED}Error: Node.js is not installed. Please install Node.js v14 or higher.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo -e "${RED}Error: Node.js version must be 14 or higher. Current version: $(node -v)${NC}"
    exit 1
fi

# Check npm
if ! command_exists npm; then
    echo -e "${RED}Error: npm is not installed. Please install npm v6 or higher.${NC}"
    exit 1
fi

# Check PostgreSQL
if ! command_exists psql; then
    echo -e "${RED}Error: PostgreSQL is not installed. Please install PostgreSQL v12 or higher.${NC}"
    exit 1
fi

# Setup environment
echo -e "${GREEN}Setting up environment...${NC}"

# Create backend .env file if it doesn't exist
if [ ! -f "../backend/.env" ]; then
    echo -e "${BLUE}Creating backend .env file...${NC}"
    cat > "../backend/.env" << EOL
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=nebulax
EOL
fi

# Start backend server
echo -e "${GREEN}Starting backend server...${NC}"
cd ../backend
npm install &> /dev/null
echo "Installing backend dependencies..."
npm run dev &
BACKEND_PID=$!
echo -e "${GREEN}Backend server started on http://localhost:4000${NC}"

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
echo -e "3. Test SSRF vulnerability:"
echo -e "   - Go to NFT Notes page"
echo -e "   - Enter ${GREEN}http://localhost:4000/api/nft/etc/passwd${NC} in Metadata URL"
echo -e "4. Test SQL injection:"
echo -e "   - In the search field, enter ${GREEN}' OR '1'='1${NC}"
echo -e "5. Press Ctrl+C to stop all servers\n"

# Handle exit
function cleanup {
    echo -e "\n${GREEN}Shutting down servers...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup INT

# Keep script running
wait