#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to display usage
function show_usage() {
  echo "Usage: $0 [options]"
  echo ""
  echo "Options:"
  echo "  -h, --help      Show this help message"
  echo "  -e, --env       Environment (development or production, defaults to development)"
  echo "  -f, --force     Force database recreation"
  echo "  -s, --seed      Seed the database after initialization"
  echo ""
}

# Default values
ENV="development"
FORCE=false
SEED=false

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
    -f|--force)
      FORCE=true
      shift # past argument
      ;;
    -s|--seed)
      SEED=true
      shift # past argument
      ;;
    *)
      echo -e "${YELLOW}Unknown option: $1${NC}"
      show_usage
      exit 1
      ;;
  esac
done

# Set environment variables
if [ "$ENV" = "production" ]; then
  export NODE_ENV=production
  DOCKER_COMPOSE_FILES="-f docker-compose.yml -f docker-compose.prod.yml"
  DB_SERVICE="db"
else
  export NODE_ENV=development
  DOCKER_COMPOSE_FILES="-f docker-compose.yml -f docker-compose.override.yml"
  DB_SERVICE="db"
fi

# Function to run a command in the backend container
function run_in_backend() {
  docker-compose $DOCKER_COMPOSE_FILES exec -T backend sh -c "$1"
}

# Function to check if database is ready
function wait_for_db() {
  echo -e "${GREEN}Waiting for database to be ready...${NC}"
  
  # Try to connect to the database
  until docker-compose $DOCKER_COMPOSE_FILES exec -T $DB_SERVICE pg_isready -U $POSTGRES_USER -d $POSTGRES_DB > /dev/null 2>&1; do
    echo -e "${YELLOW}Waiting for database to be ready...${NC}"
    sleep 2
  done
  
  echo -e "${GREEN}Database is ready!${NC}"
}

# Function to drop and recreate the database
function recreate_database() {
  echo -e "${YELLOW}Dropping and recreating database...${NC}"
  
  # Stop any existing connections
  run_in_backend "psql -U $POSTGRES_USER -d postgres -c \"SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '$POSTGRES_DB' AND pid <> pg_backend_pid();""
  
  # Drop and recreate the database
  run_in_backend "dropdb -U $POSTGRES_USER --if-exists $POSTGRES_DB"
  run_in_backend "createdb -U $POSTGRES_USER $POSTGRES_DB"
  
  echo -e "${GREEN}Database recreated successfully!${NC}"
}

# Function to run migrations
function run_migrations() {
  echo -e "${GREEN}Running migrations...${NC}"
  ./scripts/db-migrate.sh run --env $ENV
}

# Function to seed the database
function seed_database() {
  if [ "$SEED" = true ]; then
    echo -e "${GREEN}Seeding database...${NC}"
    run_in_backend "npm run seed:run"
  fi
}

# Main function
function main() {
  echo -e "${GREEN}Initializing database for $ENV environment...${NC}"
  
  # Start services if not already running
  echo -e "${GREEN}Starting services...${NC}"
  docker-compose $DOCKER_COMPOSE_FILES up -d $DB_SERVICE redis
  
  # Load environment variables
  if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
  fi
  
  # Wait for database to be ready
  wait_for_db
  
  # Recreate database if force flag is set
  if [ "$FORCE" = true ]; then
    recreate_database
  fi
  
  # Run migrations
  run_migrations
  
  # Seed database if requested
  seed_database
  
  echo -e "${GREEN}Database initialization completed successfully!${NC}"
}

# Run the main function
main
