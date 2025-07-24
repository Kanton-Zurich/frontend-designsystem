/* eslint-disable global-require */
import {
  task as _task, series, src as _src, dest as _dest, parallel,
} from 'gulp';
import zip from 'gulp-zip';
import {
  resolve as _resolve, dirname, basename, extname, join, relative,
} from 'path';
import { existsSync, statSync } from 'fs';
import { argv } from 'process';
import { short } from 'git-rev-sync';
import { Inlinify } from './gulp/_functions';
import eslint2 from './gulp/estatico-eslint-2';
import webpack2 from './gulp/estatico-webpack-2';

// eslint-disable-next-line no-magic-numbers
const env = require('minimist')(argv.slice(2));

env.watch = env.watchgulp;
env.revision = `.${short()}`;

/**
 * HTML task
 * Transforms Handlebars to HTML
 *
 * Using `--watch` (or manually setting `env` to `{ watch: true }`) starts file watcher
 * When combined with `--skipBuild`, the task will not run immediately but only after changes
 */
_task('html', () => {
  const task = require('@unic/estatico-handlebars');
  const estaticoWatch = require('@unic/estatico-watch');
  const { readFileSyncCached } = require('@unic/estatico-utils');

  const instance = task({
    src: [
      './src/*.hbs',
      './src/design/*.hbs',
      './src/pages/**/*.hbs',
      './src/modules/**/!(_)*.hbs',
      './src/atoms/**/!(_)*.hbs',
      './src/preview/styleguide/*.hbs',
    ],
    srcBase: './src',
    dest: './dist',
    watch: {
      src: [
        './src/**/*.hbs',
        './src/**/*.data.js',
        './src/**/*.md',
        './gulp/helpers/*.js',
      ],
      name: 'html',
      dependencyGraph: {
        srcBase: './',
        resolver: {
          hbs: {
            match: /{{(?:>|#extend)[\s-]*["|']?([^"\s(]+).*?}}/g,
            resolve: (match /* , filePath */) => {
              if (!match[1]) {
                return null;
              }

              let resolvedPath = _resolve('./src', match[1]);

              // Add extension
              resolvedPath = `${resolvedPath}.hbs`;

              return resolvedPath;
            },
          },
          js: {
            match: /(?:require\('(.*?\.data\.js)'\)|getFileContent\('(.*?)'\))/g,
            resolve: (match, filePath) => {
              if (!(match[1] || match[2])) {
                return null;
              }

              return _resolve(dirname(filePath), match[1] || match[2]);
            },
          },
        },
      },
      watcher: estaticoWatch,
    },
    plugins: {
      handlebars: {
        partials: [
          './src/**/*.hbs',
        ],
        helpers: [
          './gulp/helpers/*.js',
        ],
      },
      // Wrap with module layout
      transformBefore: (file) => {
        if (file.path.match(/(\\|\/)modules(\\|\/)/) && file.path.indexOf('.mock.') < 0) {
          return Buffer.from(readFileSyncCached('./src/preview/layouts/module.hbs'));
        }

        if (file.path.match(/(\\|\/)atoms(\\|\/)/)) {
          return Buffer.from(readFileSyncCached('./src/preview/layouts/atom.hbs'));
        }

        return file.contents;
      },
      // Relativify absolute paths
      transformAfter: (file) => {
        let content = file.contents.toString();
        let relPathPrefix = join(relative(file.path, './src'));
        if (basename(file.path) !== 'scaffolding.hbs') {
          relPathPrefix = relPathPrefix
            // uncomment the following line for local build on Windows machines
            // .replaceAll('\\', '/') // Normalize path separator
            .replace(/\.\.$/, ''); // Remove trailing ..
          content = content.replace(/('|"|&quot;|,\s)\/(?!\^)/g, `$1${relPathPrefix}`);
        }

        content = Buffer.from(content);

        return content;
      },
    },
  }, env);

  // Don't immediately run task when skipping build
  if (env.watch && env.skipBuild) {
    return instance;
  }

  return instance();
});

/**
 * CSS task
 * Transforms Sass to CSS, uses PostCSS (autoprefixer and clean-css) to transform the output
 *
 * Using `--dev` (or manually setting `env` to `{ dev: true }`) skips minification
 * Using `--watch` (or manually setting `env` to `{ watch: true }`) starts file watcher
 * When combined with `--skipBuild`, the task will not run immediately but only after changes
 */
_task('css', () => {
  const task = require('@unic/estatico-sass');
  const estaticoWatch = require('@unic/estatico-watch');

  const instance = task({
    src: [
      './src/assets/css/**/*.scss',
      './src/preview/assets/css/**/*.scss',
    ],
    srcBase: './src/',
    dest: './dist',
    watch: {
      src: [
        './src/**/*.scss',
        './src/preview/assets/css/**/*.scss',
      ],
      name: 'css',
      dependencyGraph: {
        srcBase: './',
        resolver: {
          scss: {
            match: /@import[\s-]*["|']?([^("|')\s(]+).*?/g,
            resolve: (match, filePath) => {
              if (!match[1]) {
                return null;
              }

              // Find possible path candidates
              const candidates = [
                dirname(filePath),
                './src/',
                './src/assets/css/',
              ].map((dir) => {
                const partialPath = match[1].replace(basename(match[1]), `_${basename(match[1])}`);
                const candidatePath = _resolve(dir, match[1]);
                const candidatePartialPath = _resolve(dir, partialPath);
                const candidatePaths = [
                  candidatePath,
                  candidatePartialPath,
                  // .scss extension
                  extname(candidatePath) ? candidatePath : `${candidatePath}.scss`,
                  extname(candidatePartialPath) ? candidatePartialPath : `${candidatePartialPath}.scss`,
                  // .css extension
                  extname(candidatePath) ? candidatePath : `${candidatePath}.css`,
                ];
                if (extname(candidatePath) === '.print') {
                  candidatePaths.push(`${candidatePath}.scss`);
                }

                // Remove duplicates
                return [...new Set(candidatePaths)];
              }).reduce((arr, curr) => arr.concat(curr), []); // Flatten

              return candidates.find((candidatePath) => { // eslint-disable-line arrow-body-style
                // Ignore inexistent files
                return existsSync(candidatePath) && statSync(candidatePath).isFile();
              }) || null;
            },
          },
        },
      },
      watcher: estaticoWatch,
    },
    plugins: {
      sass: {
        includePaths: [
          './src/',
          './src/assets/css/',
        ],
      },
      // Use task default (autoprefixer with .browserslistrc config)
      // postcss: [],
    },
  }, env);

  // Don't immediately run task when skipping build
  if (env.watch && env.skipBuild) {
    return instance;
  }

  return instance();
});

/**
 * CSS linting task
 * Uses Stylelint to lint (and optionally auto-fix files)
 *
 * Using `--watch` (or manually setting `env` to `{ watch: true }`) starts file watcher
 * When combined with `--skipBuild`, the task will not run immediately but only after changes
 * Adding `--fix` will auto-fix issues and save the files back to the file system
 */
_task('css:lint', () => {
  const task = require('@unic/estatico-stylelint');

  const instance = task({
    src: [
      './src/**/*.scss',
      '!./src/assets/css/templates/*.scss',
      '!./src/preview/assets/css/main.scss',
      '!./src/preview/assets/css/print.scss',
    ],
    srcBase: './src/',
    dest: './dist',
    plugins: {
      stylelint: {
        fix: env.fix,
      },
    },
    watch: {
      src: [
        './src/**/*.scss',
        '!./src/assets/css/templates/*.scss',
      ],
      name: 'css:lint',
    },
  }, env);

  // Don't immediately run task when skipping build
  if (env.watch && env.skipLinting) {
    return instance;
  }

  return instance();
});

/**
 * JavaScript bundling task
 * Uses Webpack with Babel to transpile and bundle JavaScript.
 *
 * Using `--watch` (or manually setting `env` to `{ watch: true }`) starts file watcher
 */
_task('js', (cb) => {
  const task = webpack2;
  // const task = require('@unic/estatico-webpack');
  const webpackConfig = require('./webpack.config.js').default;

  const instance = task((defaults) => ({
    webpack: webpackConfig,
    logger: defaults.logger,
  }), env);

  return instance(cb);
});

/**
 * JavaScript linting task
 * Uses ESLint to lint (and optionally auto-fix files)
 *
 * Using `--watch` (or manually setting `env` to `{ watch: true }`) starts file watcher
 * When combined with `--skipBuild`, the task will not run immediately but only after changes
 * Adding `--fix` will auto-fix issues and save the files back to the file system
 */
_task('js:lint', () => {

  const instance = eslint2({
    src: [
      './src/**/*.ts',
    ],
    srcBase: './src',
    dest: './src',
    watch: {
      src: [
        './src/**/*.ts',
      ],
      name: 'js:lint',
    },
  }, env);

  // Don't immediately run task when skipping build
  if (env.watch && env.skipLinting) {
    return instance;
  }

  return instance();
});

/**
 * JavaScript data mocks
 * Creates static JSON data mocks
 *
 * Using `--watch` (or manually setting `env` to `{ watch: true }`) starts file watcher
 * When combined with `--skipBuild`, the task will not run immediately but only after changes
 */
_task('js:mocks', () => {
  const task = require('@unic/estatico-json-mocks');

  const instance = task({
    src: [
      './src/**/*.mock.js',
    ],
    srcBase: './src',
    dest: './dist/mocks',
    watch: {
      src: [
        './src/**/*.mock.js',
      ],
      name: 'js:mocks',
    },
  }, env);

  // Don't immediately run task when skipping build
  if (env.watch && env.skipBuild) {
    return instance;
  }

  return instance();
});

/**
 * SVG spriting task
 * Uses svgstore to create a sprite from multiple SVGs
 *
 * Using `--watch` (or manually setting `env` to `{ watch: true }`) starts file watcher
 * When combined with `--skipBuild`, the task will not run immediately but only after changes
 */
_task('media:svgsprite', () => {
  const task = require('@unic/estatico-svgsprite');

  const instance = task({
    src: {
      base: './src/assets/media/svg/**/*.svg',
      demo: './src/demo/modules/svgsprite/svg/*.svg',
    },
    srcBase: './src',
    dest: './dist/assets/media/svgsprite',
    watch: {
      src: [
        './src/assets/media/svg/**/*.svg',
        './src/demo/modules/svgsprite/svg/*.svg',
      ],
      name: 'media:svgsprite',
    },
  }, env);

  // Don't immediately run task when skipping build
  if (env.watch && env.skipBuild) {
    return instance;
  }

  return instance();
});

/**
 * Serve task
 * Uses Browsersync to serve the build directory, reloads on changes
 */
_task('serve', () => {
  const task = require('@unic/estatico-browsersync');

  const instance = task({
    plugins: {
      browsersync: {
        server: './dist',
        watch: './dist/**/*.{html,css,js}',
        ghostMode: false,
        open: false,
      },
    },
  }, env);

  return instance();
});

/**
 * Scaffolding task
 * Uses `node-plop` to interactively scaffold files.
 */
_task('scaffold', () => {
  const task = require('@unic/estatico-scaffold');

  const transformModuleInput = (answers) => {
    const changeCase = require('change-case');
    const name = answers.newName || answers.name;

    return {
      ...answers,
      [answers.newName ? 'newFileName' : 'fileName']: changeCase.snakeCase(basename(name)),
      [answers.newName ? 'newClassName' : 'className']: changeCase.pascalCase(basename(name)),
      [answers.newName ? 'newModuleName' : 'moduleName']: changeCase.camelCase(basename(name)),
    };
  };

  const instance = task({
    types: [
      {
        name: 'Module',
        src: './src/modules/.scaffold/*',
        dest: './src/modules/',
        transformInput: transformModuleInput,
        modifications: (answers) => {
          const moduleName = answers.newModuleName || answers.moduleName;
          const className = answers.newClassName || answers.className;
          const fileName = answers.newFileName || answers.fileName;

          const isRemove = (answers.action === 'Remove');
          const hasJs = answers.files ? answers.files.find((file) => file.match(/{{fileName}}\.ts/)) : true;
          const hasCss = answers.files ? answers.files.find((file) => file.match(/{{fileName}}\.scss/)) : true;
          const hasPrintCss = answers.files ? answers.files.find((file) => file.match(/{{fileName}}\.print.scss/)) : true;

          switch (answers.action) {
            case 'Add':
            case 'Copy':
              return [].concat(hasJs ? [
                {
                  type: 'modify',
                  path: './src/assets/js/helpers/app.ts',
                  pattern: /(\s+)(\/\* autoinsertmodule \*\/)/m,
                  template: `$1this.modules.${moduleName} = ${className};$1$2`,
                  abortOnFail: true,
                },
                {
                  type: 'modify',
                  path: './src/assets/js/helpers/app.ts',
                  pattern: /(\s+)(\/\* autoinsertmodulereference \*\/)/m,
                  template: `$1import ${className} from '../../../modules/${fileName}/${fileName}';$1$2`,
                  abortOnFail: true,
                },
              ] : []).concat(hasCss ? [
                {
                  type: 'modify',
                  path: './src/assets/css/main.scss',
                  pattern: /(\s+)(\/\/\*autoinsertmodule\*)/m,
                  template: `$1@import '../../modules/${fileName}/${fileName}';$1$2`,
                  abortOnFail: true,
                },
              ] : []).concat(hasPrintCss ? [
                {
                  type: 'modify',
                  path: './src/assets/css/print.scss',
                  pattern: /(\s+)(\/\/\*autoinsertmodule\*)/m,
                  template: `$1@import '../../modules/${fileName}/${fileName}.print';$1$2`,
                  abortOnFail: true,
                },
              ] : []);
            case 'Rename':
            case 'Remove':
              return [].concat(hasJs ? [
                {
                  type: 'modify',
                  path: './src/assets/js/helpers/app.ts',
                  pattern: new RegExp(`(\\s+)?this.modules.${answers.moduleName} = ${answers.className};`, 'm'),
                  template: isRemove ? '' : `$1this.modules.${moduleName} = ${className};`,
                  abortOnFail: true,
                },
                {
                  type: 'modify',
                  path: './src/assets/js/helpers/app.ts',
                  pattern: new RegExp(`(\\s+)?import ${answers.className} from '../../../modules/${answers.fileName}/${answers.fileName}';`, 'm'),
                  template: isRemove ? '' : `$1import ${className} from '../../../modules/${fileName}/${fileName}';`,
                  abortOnFail: true,
                },
              ] : []).concat(hasCss ? [
                {
                  type: 'modify',
                  path: './src/assets/css/main.scss',
                  pattern: new RegExp(`(\\s+)?@import '../../modules/${answers.fileName}/${answers.fileName}';`, 'm'),
                  template: isRemove ? '' : `$1@import '../../modules/${fileName}/${fileName}';`,
                  abortOnFail: true,
                },
              ] : []).concat(hasPrintCss ? [
                {
                  type: 'modify',
                  path: './src/assets/css/print.scss',
                  pattern: new RegExp(`(\\s+)?@import '../../modules/${answers.fileName}/${answers.fileName}.print';`, 'm'),
                  template: isRemove ? '' : `$1@import '../../modules/${fileName}/${fileName}.print';`,
                  abortOnFail: true,
                },
              ] : []);
            default:
              return [];
          }
        },
      },
      {
        name: 'Page',
        src: './src/pages/.scaffold/*',
        dest: './src/pages/',
        transformInput: (answers) => {
          const changeCase = require('change-case');
          const name = answers.newName || answers.name;

          return { ...answers, [answers.newName ? 'newFileName' : 'fileName']: changeCase.snakeCase(basename(name)) };
        },
      },
      {
        name: 'Atom',
        src: './src/atoms/.scaffold/*',
        dest: './src/atoms',
        transformInput: transformModuleInput,
        modifications: (answers) => {
          const fileName = answers.newFileName || answers.fileName;

          const isRemove = (answers.action === 'Remove');
          const hasPrintCss = answers.files ? answers.files.find((file) => file.match(/{{fileName}}\.print.scss/)) : true;

          switch (answers.action) {
            case 'Add':
            case 'Copy':
              return [{
                type: 'modify',
                path: './src/assets/css/main.scss',
                pattern: /(\s+)(\/\/\*autoinsertatom\*)/m,
                template: `$1@import '../../atoms/${fileName}/${fileName}';$1$2`,
                abortOnFail: true,
              }].concat(hasPrintCss ? [
                {
                  type: 'modify',
                  path: './src/assets/css/print.scss',
                  pattern: /(\s+)(\/\/\*autoinsertatom\*)/m,
                  template: `$1@import '../../atoms/${fileName}/${fileName}.print';$1$2`,
                  abortOnFail: true,
                },
              ] : []);
            case 'Rename':
            case 'Remove':
              return [{
                type: 'modify',
                path: './src/assets/css/main.scss',
                pattern: new RegExp(`(\\s+)?@import '../../atoms/${answers.fileName}/${answers.fileName}';`, 'm'),
                template: isRemove ? '' : `$1@import '../../atoms/${fileName}/${fileName}';`,
                abortOnFail: true,
              }].concat(hasPrintCss ? [
                {
                  type: 'modify',
                  path: './src/assets/css/print.scss',
                  pattern: new RegExp(`(\\s+)?@import '../../atoms/${answers.fileName}/${answers.fileName}.print';`, 'm'),
                  template: isRemove ? '' : `$1@import '../../atoms/${fileName}/${fileName}.print';`,
                  abortOnFail: true,
                },
              ] : []);
            default:
              return [];
          }
        },
      },
    ],
  }, env);

  return instance();
});

/**
 * Copy files
 * Copies files, optionally renames them.
 *
 * Using `--watch` (or manually setting `env` to `{ watch: true }`) starts file watcher
 * When combined with `--skipBuild`, the task will not run immediately but only after changes
 */
_task('copy', () => {
  const task = require('@unic/estatico-copy');

  const instance = task({
    src: [
      './src/**/*.{png,gif,jpg,woff,woff2,ttf,jpeg,zip}',
      './src/assets/media/image/*.svg',
      './src/assets/media/pngsprite/*',
      './src/assets/mocks/**/*.json',
      './src/modules/**/*.mock.html',
      './src/assets/manifest.json',
    ],
    srcBase: './src',
    dest: './dist',
    watch: {
      src: [
        './src/**/*.{png,gif,jpg,woff,woff2,ttf,jpeg,json}',
      ],
      name: 'copy',
    },
  }, env);

  // Don't immediately run task when skipping build
  if (env.watch && env.skipBuild) {
    return instance;
  }

  return instance();
});

/**
 * Clean build directory
 */
_task('clean', () => {
  const del = require('del');
  return del(['./dist', './www', './src/assets/.tmp']);
});

/**
 * Deploy offline page
 */
_task('deploy:offlinepage', () => Inlinify('./dist/pages/pagedownerror/pagedownerror.html', './dist/ci/offline/', 'index.html'));

/**
 * Inlinify E-Mail assets
 */
_task('email:inlineassets', () => Inlinify('./dist/pages/mail/mail.html'));

/**
 * Zip deployment package
 */
_task('zip', () => _src(['dist/ci/prod/**/*'])
  .pipe(zip('deploy.zip'))
  .pipe(_dest('dist/ci')));

/**
 * Zip offline package
 */
_task('zip:offline', () => _src('dist/ci/offline/**/*')
  .pipe(zip('offline.zip'))
  .pipe(_dest('dist')));

/**
 * Lint / validate
 */
_task('lint', parallel('css:lint', 'js:lint'));

/**
 * Create complete build
 * Prompts whether linting should run when in --watch mode
 *
 * --noInteractive / --skipLinting will bypass the prompt
 * --ci will create complete builds in `dist/ci/dev` and `dist/ci/prod` directories
 */
_task('build', (done) => {
  let task = parallel(
    'html',
    'js',
    'js:mocks',
    'media:svgsprite',
    'copy',
    'css'
  );
  let readEnv = new Promise((resolve) => { resolve(); });

  // Clean first
  if (!env.skipBuild) {
    task = series('clean', task);
  }

  // create offline page & inlinfify assets
  task = series(task, 'email:inlineassets');

  if (env.watch && (!env.skipBuild && !env.noInteractive && !env.skipLinting)) {
    const inquirer = require('inquirer');

    readEnv = inquirer.prompt([{
      type: 'confirm',
      name: 'skipLinting',
      message: 'Do you want to skip linting?',
      default: false,
    }]).then((answers) => {
      // Persist answer to env
      env.skipLinting = answers.skipLinting;

      return env;
    });
  }

  readEnv.then(() => {
    if (!env.skipLinting || (env.watch && env.skipBuild)) {
      // In watch mode, the main task will not finish so we need to run everything in parallel
      if (env.watch && env.skipBuild) {
        task = parallel(task, 'lint');
      } else {
        task = series(task, parallel('lint'));
      }
    }

    task(done);
  });
});

/**
 * Default development task
 * Prompts whether build should be created initially when in --watch mode
 *
 * --noInteractive / --skipBuild will bypass the prompt
 */
_task('default', (done) => {
  let readEnv = new Promise((resolve) => { resolve(); });

  if (env.watch && (!env.noInteractive && !env.skipBuild)) {
    const inquirer = require('inquirer');

    readEnv = inquirer.prompt([{
      type: 'confirm',
      name: 'skipBuild',
      message: 'Do you want to skip the build before starting the server?',
      default: false,
    }]).then((answers) => {
      // Persist answer to env
      env.skipBuild = answers.skipBuild;

      return env;
    });
  }

  readEnv.then(() => {
    // When starting watcher without building, "build" will never finish
    // In order for "serve" to still run properly, we switch from serial to parallel execution
    if (env.skipBuild) {
      env.skipLinting = true;

      return parallel('build', 'serve')(done);
    }

    return series('build', 'serve')(done);
  });
});
