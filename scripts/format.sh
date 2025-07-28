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
  echo "  -c, --check     Check formatting without making changes"
  echo "  -a, --all       Format all files (including node_modules)"
  echo ""
}

# Default values
CHECK_ONLY=false
INCLUDE_NODE_MODULES=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    -h|--help)
      show_usage
      exit 0
      ;;
    -c|--check)
      CHECK_ONLY=true
      shift
      ;;
    -a|--all)
      INCLUDE_NODE_MODULES=true
      shift
      ;;
    *)
      echo -e "${YELLOW}Unknown option: $1${NC}"
      show_usage
      exit 1
      ;;
  esac
done

# Function to format files in a directory
function format_directory() {
  local dir=$1
  local check_only=$2
  local include_node_modules=$3
  
  echo -e "${GREEN}Formatting files in $dir...${NC}"
  
  local command="cd $dir && "
  
  if [ "$check_only" = true ]; then
    command+="npm run format:check"
  else
    command+="npm run format"
  fi
  
  if [ "$include_node_modules" = false ]; then
    command+=" -- --ignore-path ../.gitignore"
  fi
  
  if ! eval "$command"; then
    if [ "$check_only" = true ]; then
      echo -e "${YELLOW}Formatting issues found in $dir${NC}"
      return 1
    else
      echo -e "${YELLOW}Failed to format files in $dir${NC}"
      return 1
    fi
  fi
  
  return 0
}

# Function to format files in a Docker container
function format_in_container() {
  local service=$1
  local check_only=$2
  
  echo -e "${GREEN}Formatting files in $service...${NC}"
  
  local command="cd /app/$service && "
  
  if [ "$check_only" = true ]; then
    command+="npm run format:check"
  else
    command+="npm run format"
  fi
  
  if ! docker-compose exec -T $service sh -c "$command"; then
    if [ "$check_only" = true ]; then
      echo -e "${YELLOW}Formatting issues found in $service${NC}"
      return 1
    else
      echo -e "${YELLOW}Failed to format files in $service${NC}"
      return 1
    fi
  fi
  
  return 0
}

# Main function
function main() {
  local exit_code=0
  
  # Format backend
  if ! format_in_container "backend" $CHECK_ONLY; then
    exit_code=1
  fi
  
  # Format frontend
  if ! format_in_container "frontend" $CHECK_ONLY; then
    exit_code=1
  fi
  
  # Format admin dashboard
  if ! format_in_container "admin" $CHECK_ONLY; then
    exit_code=1
  fi
  
  # Format root directory
  if [ -f "package.json" ]; then
    if ! format_directory "." $CHECK_ONLY $INCLUDE_NODE_MODULES; then
      exit_code=1
    fi
  fi
  
  if [ $exit_code -eq 0 ]; then
    echo -e "${GREEN}Formatting completed successfully!${NC}"
  else
    if [ "$CHECK_ONLY" = true ]; then
      echo -e "${YELLOW}Formatting issues found. Run 'npm run format' to fix them.${NC}"
    else
      echo -e "${YELLOW}Some files could not be formatted automatically.${NC}"
    fi
  fi
  
  exit $exit_code
}

# Run the main function
main
