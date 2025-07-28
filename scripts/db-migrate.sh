#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to display usage
function show_usage() {
  echo "Usage: $0 [command] [options]"
  echo ""
  echo "Commands:"
  echo "  create <name>    Create a new migration"
  echo "  run              Run all pending migrations"
  echo "  revert           Revert the last migration"
  echo "  generate <name>  Generate a new migration by comparing entities"
  echo "  show             Show all migrations and their status"
  echo ""
  echo "Options:"
  echo "  -h, --help      Show this help message"
  echo "  -e, --env       Environment (development or production, defaults to development)"
  echo ""
}

# Default environment
ENV="development"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    -h|--help)
      show_usage
      exit 0
      ;;
    -e|--env)
      ENV="$2"
      shift # past argument
      shift # past value
      ;;
    *)
      COMMAND="$1"
      shift # past command
      break # break the loop to process the rest as command arguments
      ;;
  esac
done

# Set environment variables
if [ "$ENV" = "production" ]; then
  export NODE_ENV=production
  DOCKER_COMPOSE_FILES="-f docker-compose.yml -f docker-compose.prod.yml"
else
  export NODE_ENV=development
  DOCKER_COMPOSE_FILES="-f docker-compose.yml -f docker-compose.override.yml"
fi

# Function to run a command in the backend container
function run_in_backend() {
  docker-compose $DOCKER_COMPOSE_FILES exec -T backend sh -c "$1"
}

# Function to create a new migration
function create_migration() {
  local name=$1
  if [ -z "$name" ]; then
    echo -e "${YELLOW}Error: Migration name is required${NC}"
    show_usage
    exit 1
  fi
  
  echo -e "${GREEN}Creating new migration: $name${NC}"
  run_in_backend "npm run migration:create src/migrations/$name"
}

# Function to run migrations
function run_migrations() {
  echo -e "${GREEN}Running migrations...${NC}"
  run_in_backend "npm run migration:run"
}

# Function to revert the last migration
function revert_migration() {
  echo -e "${YELLOW}Reverting last migration...${NC}"
  run_in_backend "npm run migration:revert"
}

# Function to generate a migration
function generate_migration() {
  local name=$1
  if [ -z "$name" ]; then
    echo -e "${YELLOW}Error: Migration name is required${NC}"
    show_usage
    exit 1
  fi
  
  echo -e "${GREEN}Generating migration: $name${NC}"
  run_in_backend "npm run migration:generate src/migrations/$name"
}

# Function to show migration status
function show_migrations() {
  echo -e "${GREEN}Migration status:${NC}"
  run_in_backend "npm run typeorm migration:show"
}

# Execute the appropriate command
case $COMMAND in
  create)
    create_migration "$@"
    ;;
  run)
    run_migrations
    ;;
  revert)
    revert_migration
    ;;
  generate)
    generate_migration "$@"
    ;;
  show)
    show_migrations
    ;;
  *)
    echo -e "${YELLOW}Error: Unknown command${NC}"
    show_usage
    exit 1
    ;;
esac

echo -e "${GREEN}Done!${NC}"
