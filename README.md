# CZHDEV - Go Live 1.0 Release Branch

Kanton Zürich Estatico Nuo Living Styleguide

## Installation

```bash
# Optionally use Docker container, see below

# Install correct node version v10.x.x
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

## Create archetype for embedded application wrapper
- To create a development environment archetype project for creating markup for an embedded application (Component: mdl-application) an archetype project can be created
- The archetype can be found after generating in the dist folder ``dist/app_archetype`` or packed ``dist/app_archetype.zip``


```bash
npm run archetype
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
