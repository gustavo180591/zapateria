#!/bin/bash

# Create main directories
mkdir -p frontend/{public,src/{assets,components,pages,services,utils,context,styles}}
mkdir -p backend/{src/{controllers,middlewares,models,routes,services,utils,config}}
mkdir -p mobile-app/{src/{screens,components,services,navigation,assets,utils,hooks}}
mkdir -p admin-dashboard/{public,src/{components,pages,services,utils,context,styles}}
mkdir -p database/{migrations,seeds,schemas}
mkdir -p tests/{unit,integration,e2e}
mkdir -p infrastructure/{docker,kubernetes,ci-cd}
mkdir -p docs/{api,architecture,database,deployment}

# Create .gitkeep files in all directories
find . -type d -not -path "*/node_modules/*" -not -path "*/.git/*" -exec touch {}/.gitkeep \;

echo "Project structure created successfully!"
