#!/bin/bash

# Define an array of microservice names
MICROSERVICES=("auth" "users" "payments" "file-manager" "email-service")

# Function to initialize a microservice
init_microservice() {
  SERVICE=$1
  echo "Initializing microservice: $SERVICE"

  # Create directory
  mkdir -p $SERVICE
  cd $SERVICE

  # Initialize npm
  npm init -y

  # Install Express, TypeScript, ts-node, and Nodemon
  npm install express
  npm install typescript ts-node @types/node @types/express
  npm install --save-dev nodemon esbuild

  # Install developer-friendly tools
  npm install --save-dev prettier jest supertest dotenv

  # Initialize TypeScript configuration with ESNext for ESM (ECMAScript Modules)
  npx tsc --init --module ESNext --target ES6

  # Create basic TypeScript Express server (app.ts) using ES Modules (ESM)
  cat <<EOL > app.ts
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
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
  console.log('\$SERVICE service running on port', PORT);
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

# Build TypeScript files with esbuild
RUN npx esbuild src/app.ts --outfile=dist/app.js --bundle --platform=node --target=node18

# Expose port
EXPOSE 3000

# Start the server using the built file
CMD ["node", "dist/app.js"]
EOL

  # Create .dockerignore
  cat <<EOL > .dockerignore
node_modules
npm-debug.log
EOL

  # Create tsconfig.json with ES Module support
  cat <<EOL > tsconfig.json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "ESNext",  // Enable ECMAScript Modules (ESM)
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["./**/*.ts"],
  "exclude": ["node_modules"]
}
EOL

  # Create nodemon.json for hot-reloading
  cat <<EOL > nodemon.json
{
  "watch": ["src"],
  "ext": "ts",
  "exec": "npx ts-node src/app.ts"
}
EOL

  # Move app.ts to src folder
  mkdir -p src
  mv app.ts src/app.ts

  # Create Jest configuration for testing
  cat <<EOL > jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    "**/tests/**/*.test.ts"
  ]
};
EOL

  # Create a simple test file in the tests folder
  mkdir -p tests
  cat <<EOL > tests/app.test.ts
import request from 'supertest';
import app from '../src/app';

describe('$SERVICE service', () => {
  it('should return Hello from $SERVICE service!', async () => {
    const response = await request(app).get('/');
    expect(response.text).toBe('Hello from $SERVICE service!');
  });
});
EOL

  # Initialize Prettier configuration
  cat <<EOL > .prettierrc
{
  "singleQuote": true,
  "semi": true
}
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
