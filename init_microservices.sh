#!/bin/bash

# Define an array of microservice names
MICROSERVICES=("auth" "users" "payments")

# Function to initialize a microservice
init_microservice() {
  SERVICE=$1
  echo "Initializing microservice: $SERVICE"

  # Create directory
  mkdir -p $SERVICE
  cd $SERVICE

  # Initialize npm
  npm init -y

  # Install Express
  npm install express

  # Create basic Express server (app.js)
  cat <<EOL > app.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from $SERVICE service!');
});

// Start server
app.listen(PORT, () => {
  console.log('$SERVICE service running on port', PORT);
});
EOL

  # Create Dockerfile
  cat <<EOL > Dockerfile
# Use official Node.js LTS image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "app.js"]
EOL

  # Create .dockerignore
  cat <<EOL > .dockerignore
node_modules
npm-debug.log
EOL

  # Go back to root directory
  cd ..
}

# Initialize all microservices
for SERVICE in "${MICROSERVICES[@]}"; do
  init_microservice $SERVICE
done

# Create docker-compose.yml in the root directory
cat <<EOL > docker-compose.yml
version: '3.8'

services:
EOL

# Append each service to docker-compose.yml
for SERVICE in "${MICROSERVICES[@]}"; do
  cat <<EOL >> docker-compose.yml
  $SERVICE:
    build: ./$SERVICE
    ports:
      - "3000:3000" # Adjust ports as needed
    environment:
      - PORT=3000
    networks:
      - app-network
EOL
done

# Add network configuration
cat <<EOL >> docker-compose.yml

networks:
  app-network:
    driver: bridge
EOL

echo "Initialization complete. You can now run 'docker-compose up' to start all services."
