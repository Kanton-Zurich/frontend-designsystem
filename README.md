# Frontend design system for Kanton Zürich

Boilerplate based on Estatico Nuo

## Installation

```bash
# Optionally use Docker container, see below

# Install correct node version v20.x.x use node version manager nvm or manually install node version 20.x.x
nvm install

# Install npm packages
npm install
```

Dependency: Graphicsmagick http://www.graphicsmagick.org/README.html has to be manually installed

## Usage

- Run default task, building everything and starting web server: `$ npm run gulp -- --dev --watch`
- Run specific task: `$ npm run html -- -

See `gulpfile.js` for details.

## Basic run/watch command

```bash
npm run start
```

## Build all assets for deployment

```bash
npm run build
```

## Create a new module / page /atom

```bash
npm run gulp scaffold
```

## Docker

```bash
# Create image (only initially and after changes to the Dockerfile)
docker build -t czhdev .

# Start container and mount project directory
docker container run -it -p 9000:9000 -p 35729:35729 -v $(pwd):/app czhdev /bin/bash

# Continue above (nvm is preinstalled in the box)
# After installing the correct node version via nvm, it might be helpful to commit this new state so it is persisted for the next run:
# docker commit CONTAINER_ID czhdev
```
