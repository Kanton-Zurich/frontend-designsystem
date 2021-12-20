# Frontend design system for Kanton Zürich

Boiler plate based on Estatico Nuo

## Installation

```bash
# Optionally use Docker container, see below

# Install correct node version v10.x.x use node version manager nvm or manually install node version 10.x.x
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

## Create archetype for external develoment or embedded application creation
- To create a development environment archetype project for creating markup for an embedded application (Component: mdl-application) an archetype project can be created
- Modules and atoms can be included or excluded at discretion (!) Caution: some modules are depending on atoms or other modules so some combinations can not be created and will lead to build errors.
- The generated archetype can be found in the folder ``dist/app_archetype`` or as package ``dist/app_archetype.zip``

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
