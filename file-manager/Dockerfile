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
