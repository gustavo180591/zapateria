#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to display usage
function show_usage() {
  echo "Usage: $0 [command] [options]"
  echo ""
  echo "Commands:"
  echo "  start           Start all services"
  echo "  stop            Stop all services"
  echo "  restart         Restart all services"
  echo "  logs [service]  View logs for all or specific service"
  echo "  test            Run tests"
  echo "  lint            Run linter"
  echo "  format          Format code"
  echo "  db              Database management"
  echo "  shell [service] Open shell in a service container"
  echo "  clean           Clean up temporary files and containers"
  echo "  help            Show this help message"
  echo ""
  echo "Options:
  -h, --help      Show this help message"
  echo ""
}

# Function to display database help
function show_db_help() {
  echo "Database Management Commands:"
  echo "  $0 db migrate [name]  Create a new migration"
  echo "  $0 db up             Run pending migrations"
  echo "  $0 db down           Rollback the last migration"
  echo "  $0 db reset          Reset the database"
  echo "  $0 db seed           Seed the database with test data"
  echo "  $0 db status         Show migration status"
  echo ""
}

# Function to start services
function start_services() {
  echo -e "${GREEN}Starting services...${NC}"
  docker-compose up -d
  show_service_status
}

# Function to stop services
function stop_services() {
  echo -e "${YELLOW}Stopping services...${NC}"
  docker-compose down
}

# Function to restart services
function restart_services() {
  stop_services
  start_services
}

# Function to show service status
function show_service_status() {
  echo -e "\n${BLUE}Service Status:${NC}"
  docker-compose ps
  
  echo -e "\n${BLUE}Access URLs:${NC}"
  echo -e "- Frontend:       http://localhost:3000"
  echo -e "- Backend API:    http://localhost:3001/graphql"
  echo -e "- Admin Dashboard: http://localhost:3002"
  echo -e "- Database:       localhost:5432"
  echo -e "- Redis:          localhost:6379"
  echo -e "- PgAdmin:        http://localhost:5050"
}

# Function to show logs
function show_logs() {
  local service=$1
  if [ -z "$service" ]; then
    docker-compose logs -f
  else
    docker-compose logs -f "$service"
  fi
}

# Function to run tests
function run_tests() {
  ./scripts/test.sh "$@"
}

# Function to run linter
function run_linter() {
  echo -e "${GREEN}Running linter...${NC}"
  docker-compose exec -T backend npm run lint
  docker-compose exec -T frontend npm run lint
  docker-compose exec -T admin npm run lint
}

# Function to format code
function format_code() {
  ./scripts/format.sh
}

# Function to handle database commands
function handle_db_command() {
  local cmd=$1
  local name=$2
  
  case $cmd in
    migrate)
      if [ -z "$name" ]; then
        echo -e "${RED}Error: Migration name is required${NC}"
        show_db_help
        exit 1
      fi
      echo -e "${GREEN}Creating migration: $name${NC}"
      docker-compose exec -T backend npm run migration:generate "src/migrations/$name"
      ;;
    up)
      echo -e "${GREEN}Running migrations...${NC}"
      docker-compose exec -T backend npm run migration:run
      ;;
    down)
      echo -e "${YELLOW}Reverting last migration...${NC}"
      docker-compose exec -T backend npm run migration:revert
      ;;
    reset)
      echo -e "${YELLOW}Resetting database...${NC}"
      docker-compose exec -T backend npm run schema:drop
      docker-compose exec -T backend npm run migration:run
      ;;
    seed)
      echo -e "${GREEN}Seeding database...${NC}"
      docker-compose exec -T backend npm run seed:run
      ;;
    status)
      echo -e "${GREEN}Migration status:${NC}"
      docker-compose exec -T backend npm run typeorm migration:show
      ;;
    *)
      show_db_help
      exit 1
      ;;
  esac
}

# Function to open shell in a container
function open_shell() {
  local service=$1
  if [ -z "$service" ]; then
    echo -e "${YELLOW}No service specified. Available services:${NC}"
    docker-compose ps --services
    exit 1
  fi
  
  docker-compose exec "$service" sh
}

# Function to clean up
function clean() {
  echo -e "${YELLOW}Cleaning up...${NC}"
  
  # Stop and remove containers
  docker-compose down -v --remove-orphans
  
  # Remove node_modules
  echo -e "${YELLOW}Removing node_modules...${NC}"
  find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
  
  # Remove build artifacts
  echo -e "${YELLOW}Removing build artifacts...${NC}"
  rm -rf backend/dist
  rm -rf frontend/build
  rm -rf admin/build
  
  # Remove logs and temp files
  echo -e "${YELLOW}Removing logs and temp files...${NC}"
  rm -rf logs/*
  rm -rf tmp/*
  
  echo -e "${GREEN}Cleanup complete!${NC}"
}

# Main function
function main() {
  local command=$1
  shift
  
  case $command in
    start)
      start_services
      ;;
    stop)
      stop_services
      ;;
    restart)
      restart_services
      ;;
    logs)
      show_logs "$@"
      ;;
    test)
      run_tests "$@"
      ;;
    lint)
      run_linter
      ;;
    format)
      format_code
      ;;
    db)
      handle_db_command "$@"
      ;;
    shell)
      open_shell "$1"
      ;;
    clean)
      clean
      ;;
    help|--help|-h)
      show_usage
      ;;
    *)
      if [ -z "$command" ]; then
        show_usage
      else
        echo -e "${RED}Unknown command: $command${NC}"
        show_usage
        exit 1
      fi
      ;;
  esac
}

# Run the main function
main "$@"
