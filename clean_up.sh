#!/bin/bash

# Define the array of microservice directories
MICROSERVICES=("auth" "users" "payments" "profiles" "file-manager" "email-service" "groceries")

# Loop through each microservice and clean up node_modules, package-lock.json, and yarn.lock
for SERVICE in "${MICROSERVICES[@]}"; do
  echo "Cleaning up $SERVICE..."

  # Check if the directory exists
  if [ -d "$SERVICE" ]; then
    cd $SERVICE

    # Remove node_modules if it exists
    if [ -d "node_modules" ]; then
      echo "Removing node_modules in $SERVICE..."
      rm -rf node_modules
    fi

    # Remove package-lock.json if it exists
    if [ -f "package-lock.json" ]; then
      echo "Removing package-lock.json in $SERVICE..."
      rm package-lock.json
    fi

    # Remove yarn.lock if it exists
    if [ -f "yarn.lock" ]; then
      echo "Removing yarn.lock in $SERVICE..."
      rm yarn.lock
    fi

    # Navigate back to the root directory
    cd ..
  else
    echo "Directory $SERVICE does not exist."
  fi
done

echo "Cleanup completed for all microservices."
