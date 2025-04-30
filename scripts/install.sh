#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to detect OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Try to detect specific Linux distribution
        if [ -f /etc/os-release ]; then
            . /etc/os-release
            OS=$NAME
            VER=$VERSION_ID
        elif type lsb_release >/dev/null 2>&1; then
            OS=$(lsb_release -si)
            VER=$(lsb_release -sr)
        else
            OS=$(uname -s)
            VER=$(uname -r)
        fi
        echo "linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    else
        echo "unknown"
    fi
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install Node.js and npm
install_node() {
    echo -e "${BLUE}Installing Node.js and npm...${NC}"
    
    if command_exists node && command_exists npm; then
        echo -e "${GREEN}Node.js and npm are already installed.${NC}"
        return
    fi

    OS_TYPE=$(detect_os)
    
    if [ "$OS_TYPE" = "linux" ]; then
        # Linux installation
        if command_exists apt-get; then
            # Debian/Ubuntu
            curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
            sudo apt-get install -y nodejs
        elif command_exists yum; then
            # RHEL/CentOS
            curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
            sudo yum install -y nodejs
        elif command_exists pacman; then
            # Arch Linux
            sudo pacman -S nodejs npm
        else
            echo -e "${RED}Unsupported Linux distribution. Please install Node.js manually.${NC}"
            exit 1
        fi
    elif [ "$OS_TYPE" = "macos" ]; then
        # macOS installation
        if ! command_exists brew; then
            echo -e "${RED}Homebrew is not installed. Installing Homebrew first...${NC}"
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
            # Add Homebrew to PATH for the current session
            eval "$(/opt/homebrew/bin/brew shellenv)"
        fi
        brew install node
    else
        echo -e "${RED}Unsupported operating system. Please install Node.js manually.${NC}"
        exit 1
    fi

    echo -e "${GREEN}Node.js and npm installed successfully.${NC}"
}

# Function to install PostgreSQL
install_postgres() {
    echo -e "${BLUE}Installing PostgreSQL...${NC}"
    
    if command_exists psql; then
        echo -e "${GREEN}PostgreSQL is already installed.${NC}"
        return
    fi

    OS_TYPE=$(detect_os)
    
    if [ "$OS_TYPE" = "linux" ]; then
        # Linux installation
        if command_exists apt-get; then
            # Debian/Ubuntu
            sudo apt-get update
            sudo apt-get install -y postgresql postgresql-contrib
            sudo systemctl start postgresql
            sudo systemctl enable postgresql
        elif command_exists yum; then
            # RHEL/CentOS
            sudo yum install -y postgresql-server postgresql-contrib
            sudo postgresql-setup --initdb
            sudo systemctl start postgresql
            sudo systemctl enable postgresql
        elif command_exists pacman; then
            # Arch Linux
            sudo pacman -S postgresql
            sudo systemctl start postgresql
            sudo systemctl enable postgresql
        else
            echo -e "${RED}Unsupported Linux distribution. Please install PostgreSQL manually.${NC}"
            exit 1
        fi
    elif [ "$OS_TYPE" = "macos" ]; then
        # macOS installation
        if ! command_exists brew; then
            echo -e "${RED}Homebrew is not installed. Installing Homebrew first...${NC}"
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
            eval "$(/opt/homebrew/bin/brew shellenv)"
        fi
        brew install postgresql@12
        brew services start postgresql@12
        # Add PostgreSQL to PATH
        echo 'export PATH="/opt/homebrew/opt/postgresql@12/bin:$PATH"' >> ~/.zshrc
        source ~/.zshrc
    else
        echo -e "${RED}Unsupported operating system. Please install PostgreSQL manually.${NC}"
        exit 1
    fi

    echo -e "${GREEN}PostgreSQL installed successfully.${NC}"
}

# Function to setup database
setup_database() {
    echo -e "${BLUE}Setting up database...${NC}"
    
    OS_TYPE=$(detect_os)
    
    if [ "$OS_TYPE" = "linux" ]; then
        # Linux database setup
        sudo -u postgres psql -c "CREATE DATABASE nebulax;" || true
        sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'postgres';" || true
        sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE nebulax TO postgres;" || true
    elif [ "$OS_TYPE" = "macos" ]; then
        # macOS database setup
        createdb nebulax || true
        psql postgres -c "CREATE USER postgres WITH PASSWORD 'postgres';" || true
        psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE nebulax TO postgres;" || true
    fi

    echo -e "${GREEN}Database setup completed.${NC}"
}

# Function to install project dependencies
install_project_deps() {
    echo -e "${BLUE}Installing project dependencies...${NC}"
    
    # Install backend dependencies
    echo -e "${BLUE}Installing backend dependencies...${NC}"
    cd ../backend
    npm install
    
    # Install frontend dependencies
    echo -e "${BLUE}Installing frontend dependencies...${NC}"
    cd ../frontend
    npm install
    
    echo -e "${GREEN}Project dependencies installed successfully.${NC}"
}

# Print banner
echo -e "${BLUE}"
echo -e "███╗   ██╗███████╗██████╗ ██╗   ██╗██╗      █████╗ ██╗  ██╗"
echo -e "████╗  ██║██╔════╝██╔══██╗██║   ██║██║     ██╔══██╗╚██╗██╔╝"
echo -e "██╔██╗ ██║█████╗  ██████╔╝██║   ██║██║     ███████║ ╚███╔╝ "
echo -e "██║╚██╗██║██╔══╝  ██╔══██╗██║   ██║██║     ██╔══██║ ██╔██╗ "
echo -e "██║ ╚████║███████╗██████╔╝╚██████╔╝███████╗██║  ██║██╔╝ ██╗"
echo -e "╚═╝  ╚═══╝╚══════╝╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝"
echo -e "${GREEN}NebulaX Web3 Lab - Installation Script${NC}\n"

# Warning message
echo -e "${RED}WARNING: This application contains intentional security vulnerabilities for educational purposes.${NC}"
echo -e "${RED}DO NOT use real credentials or deploy to production.${NC}\n"

# Main installation process
echo -e "${BLUE}Starting installation process...${NC}"

# Install Node.js and npm
install_node

# Install PostgreSQL
install_postgres

# Setup database
setup_database

# Install project dependencies
install_project_deps

echo -e "\n${GREEN}Installation completed successfully!${NC}"
echo -e "\n${BLUE}Next steps:${NC}"
echo -e "1. Run the application using: ${GREEN}./scripts/run.sh${NC}"
echo -e "2. Access the application at: ${GREEN}http://localhost:3000${NC}"
echo -e "3. Test the vulnerabilities as described in the README.md\n" 