#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to display a header
function header() {
  echo -e "\n${BLUE}=== $1 ===${NC}\n"
}

# Function to run a command with status
function run_command() {
  local cmd="$@"
  echo -e "${YELLOW}Running: $cmd${NC}"
  
  if eval "$cmd"; then
    echo -e "${GREEN}✓ Success${NC}"
    return 0
  else
    echo -e "${YELLOW}✗ Failed${NC}"
    return 1
  fi
}

# Function to check if a command exists
function command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Function to install dependencies
function install_dependencies() {
  header "Checking System Dependencies"
  
  # Check for Docker
  if ! command_exists docker; then
    echo -e "${YELLOW}Docker is not installed. Please install Docker first.${NC}"
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
  fi
  
  # Check for Docker Compose
  if ! command_exists docker-compose; then
    echo -e "${YELLOW}Docker Compose is not installed. Please install Docker Compose.${NC}"
    exit 1
  fi
  
  # Check for Node.js
  if ! command_exists node; then
    echo -e "${YELLOW}Node.js is not installed. Please install Node.js 18 or later.${NC}"
    exit 1
  fi
  
  # Check Node.js version
  NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
  if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${YELLOW}Node.js 18 or later is required. Found version $NODE_VERSION.${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}✓ All system dependencies are installed${NC}"
}

# Function to setup environment
function setup_environment() {
  header "Setting Up Environment"
  
  # Copy .env.example to .env if it doesn't exist
  if [ ! -f ".env" ]; then
    run_command "cp .env.example .env"
    echo -e "${YELLOW}Please review the .env file and update the values as needed.${NC}"
  else
    echo -e "${GREEN}✓ .env file already exists${NC}"
  fi
  
  # Create necessary directories
  run_command "mkdir -p logs"
  run_command "mkdir -p tmp"
}

# Function to install project dependencies
function install_project_dependencies() {
  header "Installing Project Dependencies"
  
  # Start services needed for installation
  run_command "docker-compose up -d db redis"
  
  # Install root dependencies
  if [ -f "package.json" ]; then
    run_command "npm install"
  fi
  
  # Install backend dependencies
  if [ -d "backend" ]; then
    header "Installing Backend Dependencies"
    run_command "docker-compose run --rm backend npm install"
  fi
  
  # Install frontend dependencies
  if [ -d "frontend" ]; then
    header "Installing Frontend Dependencies"
    run_command "docker-compose run --rm frontend npm install"
  fi
  
  # Install admin dashboard dependencies
  if [ -d "admin-dashboard" ]; then
    header "Installing Admin Dashboard Dependencies"
    run_command "docker-compose run --rm admin npm install"
  fi
}

# Function to setup database
function setup_database() {
  header "Setting Up Database"
  
  # Wait for database to be ready
  echo -e "${YELLOW}Waiting for database to be ready...${NC}"
  until docker-compose exec -T db pg_isready -U postgres -d zapateria > /dev/null 2>&1; do
    echo -e "${YELLOW}Waiting for database to be ready...${NC}"
    sleep 2
  done
  
  # Run database migrations
  run_command "./scripts/init-db.sh --env development --seed"
}

# Function to start development servers
function start_development_servers() {
  header "Starting Development Servers"
  
  # Start all services in detached mode
  run_command "docker-compose up -d"
  
  echo -e "\n${GREEN}Development servers are starting up!${NC}"
  echo -e "\n${BLUE}Access the application at:${NC}"
  echo -e "- Frontend:       http://localhost:3000"
  echo -e "- Backend API:    http://localhost:3001/graphql"
  echo -e "- Admin Dashboard: http://localhost:3002"
  echo -e "- Database:       localhost:5432"
  echo -e "- Redis:          localhost:6379"
  echo -e "\n${BLUE}Useful Commands:${NC}"
  echo -e "- View logs:              docker-compose logs -f"
  echo -e "- Run tests:              ./scripts/test.sh"
  echo -e "- Run migrations:         ./scripts/db-migrate.sh run"
  echo -e "- Format code:            ./scripts/format.sh"
  echo -e "- Stop all services:      docker-compose down"
}

# Main function
function main() {
  echo -e "\n${BLUE}🚀 Starting Zapateria Development Setup 🚀${NC}"
  
  # Check system dependencies
  install_dependencies
  
  # Setup environment
  setup_environment
  
  # Install project dependencies
  install_project_dependencies
  
  # Setup database
  setup_database
  
  # Start development servers
  start_development_servers
  
  echo -e "\n${GREEN}✅ Setup completed successfully!${NC}"
  echo -e "${YELLOW}Don't forget to check the .env file and update any necessary configurations.${NC}"
}

# Run the main function
main
