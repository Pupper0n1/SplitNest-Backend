# SplitNest-Backend

Backend microservices repository for SplitNest. This repository contains multiple microservices managed through Docker Compose, along with scripts to automate dependency installation, cleanup, and Docker management.

## Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (with Yarn or npm)
- **Docker** and **Docker Compose**

## Setting up the Project

### 1. Make Shell Scripts Executable

Before running any commands, ensure that the shell scripts have executable permissions. Run the following commands to allow execution:

```bash
chmod +x install_all.sh
chmod +x cleanup.sh
```

### 2. Install Dependencies

After setting up the permissions, run the following commands to install all dependencies for each microservice and for the root project:

```bash
yarn install_all
yarn
```

This will:

1. Run the `install_all.sh` script to install dependencies for all microservices.
2. Install any dependencies defined in the root `package.json`.

## Available Commands

Here’s a list of useful commands that are available through `yarn`:

### Install Dependencies for All Microservices

```bash
yarn install_all
```

This runs the `install_all.sh` script, installing dependencies in all microservices.

### Clean Up Dependencies and Lock Files

```bash
yarn cleanup
```

This runs the `cleanup.sh` script, which removes `node_modules/`, `package-lock.json`, and `yarn.lock` from each microservice.

### Build Docker Containers

```bash
yarn build
```

This will run `docker compose build` to build Docker images for all microservices.

### Start All Docker Containers

```bash
yarn up
```

This will run `docker compose up` to start all the microservices in the Docker environment.

### Stop All Docker Containers

```bash
yarn down
```

This will run `docker compose down` to stop and remove all running containers.

### Rebuild and Restart Docker Containers

```bash
yarn rebuild
```

This runs `docker compose down`, `docker compose build`, and `docker compose up` in sequence. Use this command to rebuild all Docker containers and restart them.

## Structure

The repository is structured with a collection of microservices, each housed in its own folder. The automation scripts will handle installing, cleaning, and running these services.

```
project-root/
├── auth/
├── users/
├── payments/
├── profiles/
├── file-manager/
├── email-service/
├── groceries/
├── install_all.sh
├── cleanup.sh
├── docker-compose.yml
└── package.json
```
