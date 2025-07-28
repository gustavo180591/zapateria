#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to display usage
function show_usage() {
  echo "Usage: $0 [options]"
  echo ""
  echo "Options:"
  echo "  -h, --help      Show this help message"
  echo "  -u, --unit      Run only unit tests"
  echo "  -i, --int       Run only integration tests"
  echo "  -e, --e2e       Run only end-to-end tests"
  echo "  -w, --watch     Run tests in watch mode"
  echo "  -c, --coverage  Generate coverage report"
  echo "  -f, --filter    Filter test files (e.g., 'auth' for auth tests)"
  echo ""
}

# Default values
RUN_UNIT=true
RUN_INTEGRATION=true
RUN_E2E=false
WATCH=false
COVERAGE=false
FILTER=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    -h|--help)
      show_usage
      exit 0
      ;;
    -u|--unit)
      RUN_UNIT=true
      RUN_INTEGRATION=false
      RUN_E2E=false
      shift
      ;;
    -i|--int)
      RUN_UNIT=false
      RUN_INTEGRATION=true
      RUN_E2E=false
      shift
      ;;
    -e|--e2e)
      RUN_UNIT=false
      RUN_INTEGRATION=false
      RUN_E2E=true
      shift
      ;;
    -w|--watch)
      WATCH=true
      shift
      ;;
    -c|--coverage)
      COVERAGE=true
      shift
      ;;
    -f|--filter)
      FILTER="$2"
      shift
      shift
      ;;
    *)
      echo -e "${YELLOW}Unknown option: $1${NC}"
      show_usage
      exit 1
      ;;
  esac
done

# Function to run tests in a directory
function run_tests() {
  local dir=$1
  local test_type=$2
  local watch_flag=$3
  local coverage_flag=$4
  local filter_flag=$5
  
  echo -e "${GREEN}Running $test_type tests in $dir...${NC}"
  
  local command="cd $dir && npm test"
  
  if [ "$watch_flag" = true ]; then
    command="$command --watch"
  fi
  
  if [ "$coverage_flag" = true ]; then
    command="$command --coverage"
  fi
  
  if [ -n "$filter_flag" ]; then
    command="$command --testMatch=**/*$filter_flag*.test.*"
  fi
  
  if ! eval "$command"; then
    echo -e "${RED}$test_type tests failed!${NC}"
    exit 1
  fi
}

# Function to run tests in a Docker container
function run_tests_in_container() {
  local service=$1
  local test_type=$2
  local watch_flag=$3
  local coverage_flag=$4
  local filter_flag=$5
  
  echo -e "${GREEN}Running $test_type tests for $service...${NC}"
  
  local command="cd /app/$service && npm test"
  
  if [ "$watch_flag" = true ]; then
    command="$command --watch"
  fi
  
  if [ "$coverage_flag" = true ]; then
    command="$command --coverage"
  fi
  
  if [ -n "$filter_flag" ]; then
    command="$command --testMatch=**/*$filter_flag*.test.*"
  fi
  
  if ! docker-compose exec -T $service sh -c "$command"; then
    echo -e "${RED}$test_type tests for $service failed!${NC}"
    exit 1
  fi
}

# Main function
function main() {
  # Start services if not already running
  echo -e "${GREEN}Starting services...${NC}"
  docker-compose up -d db redis
  
  # Wait for database to be ready
  echo -e "${GREEN}Waiting for database to be ready...${NC}"
  until docker-compose exec -T db pg_isready -U postgres -d zapateria > /dev/null 2>&1; do
    echo -e "${YELLOW}Waiting for database to be ready...${NC}"
    sleep 2
  done
  
  # Run tests
  if [ "$RUN_UNIT" = true ]; then
    run_tests_in_container "backend" "unit" $WATCH $COVERAGE "$FILERT"
  fi
  
  if [ "$RUN_INTEGRATION" = true ]; then
    run_tests_in_container "backend" "integration" $WATCH $COVERAGE "$FILTER"
  fi
  
  if [ "$RUN_E2E" = true ]; then
    # Start all services for E2E tests
    docker-compose up -d
    
    # Wait for services to be ready
    echo -e "${GREEN}Waiting for services to be ready...${NC}"
    sleep 10
    
    run_tests "e2e" "end-to-end" $WATCH $COVERAGE "$FILTER"
  fi
  
  echo -e "${GREEN}All tests completed successfully!${NC}"
}

# Run the main function
main
