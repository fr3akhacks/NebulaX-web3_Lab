#!/bin/bash

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Check for Docker
if ! command -v docker &> /dev/null; then
  echo -e "${GREEN}Docker not found. Installing Docker...${NC}"
  if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    rm get-docker.sh
    sudo usermod -aG docker $USER
  elif [[ "$OSTYPE" == "darwin"* ]]; then
    brew install --cask docker
    echo -e "${GREEN}Please start the Docker Desktop app from Applications if not already running.${NC}"
  else
    echo -e "${RED}Unsupported OS. Please install Docker manually.${NC}"
    exit 1
  fi
else
  echo -e "${GREEN}Docker is already installed.${NC}"
fi

# Check for Docker Compose
if ! command -v docker-compose &> /dev/null; then
  echo -e "${GREEN}Docker Compose not found. Installing Docker Compose...${NC}"
  if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
  elif [[ "$OSTYPE" == "darwin"* ]]; then
    brew install docker-compose
  else
    echo -e "${RED}Unsupported OS. Please install Docker Compose manually.${NC}"
    exit 1
  fi
else
  echo -e "${GREEN}Docker Compose is already installed.${NC}"
fi

# Build Docker images
echo -e "${GREEN}Building Docker images...${NC}"
docker-compose build

echo -e "${GREEN}Installation complete! You can now run the application with ./run.sh${NC}" 