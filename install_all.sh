#!/bin/bash

# Define the array of microservice directories
MICROSERVICES=("auth" "users" "payments" "file-manager" "email-service")

# Loop through each microservice and run yarn install
for SERVICE in "${MICROSERVICES[@]}"; do
  echo "Installing dependencies for $SERVICE..."
  
  # Check if the directory exists
  if [ -d "$SERVICE" ]; then
    cd $SERVICE
    
    # Run yarn install
    yarn install
    
    # Navigate back to the root directory
    cd ..
  else
    echo "Directory $SERVICE does not exist."
  fi
done

echo "Yarn install completed for all microservices."
