# CZHDEV - Go Live 1.0 Release Branch

Kanton Zürich Estatico Nuo Living Styleguide

## Installation

```bash

# Optionally use Docker container, see below

# Install correct node version
nvm install

# Install npm packages
npm install
```

## Usage

- Run default task, building everything and starting web server: `$ npm run gulp -- --dev --watch`
- Run specific task: `$ npm run html -- -

See `gulpfile.js` for details.


## Basic run/watch command
```bash
npm run start
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
