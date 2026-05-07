/* eslint-disable global-require */
import { createRequire } from 'module';
import gulp from 'gulp';
import inquirer from 'inquirer';

const require = createRequire(import.meta.url);

const { task: _task, series, src: _src, dest: _dest, parallel } = gulp;
import zip from 'gulp-zip';
import { resolve as _resolve, dirname, basename, extname, join, relative } from 'path';
import { existsSync, statSync, readFileSync } from 'fs';
import { rm } from 'fs/promises';
import { argv } from 'process';
import { Inlinify } from './gulp/_functions.js';

const { short } = require('git-rev-sync');
import './gulp/deploy-aem.js';
import './gulp/app-archetype.js';
import eslint2 from './gulp/estatico-eslint-2.js';
import webpack2 from './gulp/estatico-webpack-2.js';

// eslint-disable-next-line no-magic-numbers
const env = require('minimist')(argv.slice(2));

env.watch = env.watchgulp;
env.aemTargetBase =
  '../czhdev-backend/sources/zhweb-core/zhweb-core-content/src/main/resources/jcr_root/apps/zhweb/core/';
env.aemTargetBaseResources = `${env.aemTargetBase}clientlibs/publish/resources/`;
env.aemAssetsProxy = '/etc.clientlibs/zhweb/core/clientlibs/publish/resources/';
env.revision = `.${short()}`;
env.aemPresent = false;

try {
  if (existsSync(env.aemTargetBaseResources)) {
    env.aemPresent = true;
  } else {
    console.log('Info: AEM not present for deployment, skipping deployment of assets');
  }
} catch (err) {
  console.log('Error: AEM not present for deployment, skipping deployment of assets');
}

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

  const instance = task(
    {
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
        src: ['./src/**/*.hbs', './src/**/*.data.js', './src/**/*.md', './gulp/helpers/*.js'],
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
          partials: ['./src/**/*.hbs'],
          helpers: ['./gulp/helpers/*.js'],
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
    },
    env
  );

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

  const instance = task(
    {
      src: ['./src/assets/css/**/*.scss', './src/preview/assets/css/**/*.scss'],
      srcBase: './src/',
      dest: './dist',
      watch: {
        src: ['./src/**/*.scss', './src/preview/assets/css/**/*.scss'],
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
                const candidates = [dirname(filePath), './src/', './src/assets/css/']
                  .map((dir) => {
                    const partialPath = match[1].replace(
                      basename(match[1]),
                      `_${basename(match[1])}`
                    );
                    const candidatePath = _resolve(dir, match[1]);
                    const candidatePartialPath = _resolve(dir, partialPath);
                    const candidatePaths = [
                      candidatePath,
                      candidatePartialPath,
                      // .scss extension
                      extname(candidatePath) ? candidatePath : `${candidatePath}.scss`,
                      extname(candidatePartialPath)
                        ? candidatePartialPath
                        : `${candidatePartialPath}.scss`,
                      // .css extension
                      extname(candidatePath) ? candidatePath : `${candidatePath}.css`,
                    ];
                    if (extname(candidatePath) === '.print') {
                      candidatePaths.push(`${candidatePath}.scss`);
                    }

                    // Remove duplicates
                    return [...new Set(candidatePaths)];
                  })
                  .reduce((arr, curr) => arr.concat(curr), []); // Flatten

                return (
                  candidates.find((candidatePath) => {
                    // eslint-disable-line arrow-body-style
                    // Ignore inexistent files
                    return existsSync(candidatePath) && statSync(candidatePath).isFile();
                  }) || null
                );
              },
            },
          },
        },
        watcher: estaticoWatch,
      },
      plugins: {
        sass: {
          includePaths: ['./src/', './src/assets/css/'],
          quietDeps: true,
          silenceDeprecations: ['import', 'legacy-js-api', 'if-function', 'global-builtin', 'color-functions'],
        },
        // Use task default (autoprefixer with .browserslistrc config)
        // postcss: [],
      },
    },
    env
  );

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

  const instance = task(
    {
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
        src: ['./src/**/*.scss', '!./src/assets/css/templates/*.scss'],
        name: 'css:lint',
      },
    },
    env
  );

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
  const instance = webpack2((defaults) => defaults, env);

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
  const instance = eslint2(
    {
      src: ['./src/**/*.ts'],
      srcBase: './src',
      dest: './src',
      watch: {
        src: ['./src/**/*.ts'],
        name: 'js:lint',
      },
    },
    env
  );

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

  const instance = task(
    {
      src: ['./src/**/*.mock.js'],
      srcBase: './src',
      dest: './dist/mocks',
      watch: {
        src: ['./src/**/*.mock.js'],
        name: 'js:mocks',
      },
    },
    env
  );

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

  const instance = task(
    {
      src: {
        base: './src/assets/media/svg/**/*.svg',
        demo: './src/demo/modules/svgsprite/svg/*.svg',
      },
      srcBase: './src',
      dest: './dist/assets/media/svgsprite',
      watch: {
        src: ['./src/assets/media/svg/**/*.svg', './src/demo/modules/svgsprite/svg/*.svg'],
        name: 'media:svgsprite',
      },
    },
    env
  );

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

  const mockStatusMap = {
    '/mocks/modules/form/form.server-error.json': 500,
    '/mocks/modules/form/form.validation-error.json': 400,
  };

  const serveMockWithStatus = (req, res, next) => {
    // Rewrite POST to GET for local mock calls.
    if (req.method === 'POST') {
      req.method = 'GET';
    }

    const requestPath = req.url.split('?')[0];
    const statusCode = mockStatusMap[requestPath];

    if (statusCode) {
      const filePath = _resolve('./dist', `.${requestPath}`);

      if (existsSync(filePath)) {
        res.statusCode = statusCode;
        res.setHeader('Content-Type', 'application/json');
        res.end(readFileSync(filePath, 'utf8'));
        return;
      }
    }

    // Respond with optional delay
    // Example: http://localhost:9000/mocks/demo/modules/slideshow/modules.json?delay=5000
    const delay = req.url.match(/delay=([0-9]+)/);

    if (delay) {
      setTimeout(() => {
        next();
      }, delay[1]);
    } else {
      next();
    }
  };

  const instance = task(
    {
      plugins: {
        browsersync: {
          server: './dist',
          watch: './dist/**/*.{html,css,js}',
          ghostMode: false,
          open: false,
          middleware: serveMockWithStatus,
        },
      },
    },
    env
  );

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

  const instance = task(
    {
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

            const isRemove = answers.action === 'Remove';
            const hasJs = answers.files
              ? answers.files.find((file) => file.match(/{{fileName}}\.ts/))
              : true;
            const hasCss = answers.files
              ? answers.files.find((file) => file.match(/{{fileName}}\.scss/))
              : true;
            const hasPrintCss = answers.files
              ? answers.files.find((file) => file.match(/{{fileName}}\.print.scss/))
              : true;

            switch (answers.action) {
              case 'Add':
              case 'Copy':
                return []
                  .concat(
                    hasJs
                      ? [
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
                        ]
                      : []
                  )
                  .concat(
                    hasCss
                      ? [
                          {
                            type: 'modify',
                            path: './src/assets/css/main.scss',
                            pattern: /(\s+)(\/\/\*autoinsertmodule\*)/m,
                            template: `$1@import '../../modules/${fileName}/${fileName}';$1$2`,
                            abortOnFail: true,
                          },
                        ]
                      : []
                  )
                  .concat(
                    hasPrintCss
                      ? [
                          {
                            type: 'modify',
                            path: './src/assets/css/print.scss',
                            pattern: /(\s+)(\/\/\*autoinsertmodule\*)/m,
                            template: `$1@import '../../modules/${fileName}/${fileName}.print';$1$2`,
                            abortOnFail: true,
                          },
                        ]
                      : []
                  );
              case 'Rename':
              case 'Remove':
                return []
                  .concat(
                    hasJs
                      ? [
                          {
                            type: 'modify',
                            path: './src/assets/js/helpers/app.ts',
                            pattern: new RegExp(
                              `(\\s+)?this.modules.${answers.moduleName} = ${answers.className};`,
                              'm'
                            ),
                            template: isRemove
                              ? ''
                              : `$1this.modules.${moduleName} = ${className};`,
                            abortOnFail: true,
                          },
                          {
                            type: 'modify',
                            path: './src/assets/js/helpers/app.ts',
                            pattern: new RegExp(
                              `(\\s+)?import ${answers.className} from '../../../modules/${answers.fileName}/${answers.fileName}';`,
                              'm'
                            ),
                            template: isRemove
                              ? ''
                              : `$1import ${className} from '../../../modules/${fileName}/${fileName}';`,
                            abortOnFail: true,
                          },
                        ]
                      : []
                  )
                  .concat(
                    hasCss
                      ? [
                          {
                            type: 'modify',
                            path: './src/assets/css/main.scss',
                            pattern: new RegExp(
                              `(\\s+)?@import '../../modules/${answers.fileName}/${answers.fileName}';`,
                              'm'
                            ),
                            template: isRemove
                              ? ''
                              : `$1@import '../../modules/${fileName}/${fileName}';`,
                            abortOnFail: true,
                          },
                        ]
                      : []
                  )
                  .concat(
                    hasPrintCss
                      ? [
                          {
                            type: 'modify',
                            path: './src/assets/css/print.scss',
                            pattern: new RegExp(
                              `(\\s+)?@import '../../modules/${answers.fileName}/${answers.fileName}.print';`,
                              'm'
                            ),
                            template: isRemove
                              ? ''
                              : `$1@import '../../modules/${fileName}/${fileName}.print';`,
                            abortOnFail: true,
                          },
                        ]
                      : []
                  );
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

            return {
              ...answers,
              [answers.newName ? 'newFileName' : 'fileName']: changeCase.snakeCase(basename(name)),
            };
          },
        },
        {
          name: 'Atom',
          src: './src/atoms/.scaffold/*',
          dest: './src/atoms',
          transformInput: transformModuleInput,
          modifications: (answers) => {
            const fileName = answers.newFileName || answers.fileName;

            const isRemove = answers.action === 'Remove';
            const hasPrintCss = answers.files
              ? answers.files.find((file) => file.match(/{{fileName}}\.print.scss/))
              : true;

            switch (answers.action) {
              case 'Add':
              case 'Copy':
                return [
                  {
                    type: 'modify',
                    path: './src/assets/css/main.scss',
                    pattern: /(\s+)(\/\/\*autoinsertatom\*)/m,
                    template: `$1@import '../../atoms/${fileName}/${fileName}';$1$2`,
                    abortOnFail: true,
                  },
                ].concat(
                  hasPrintCss
                    ? [
                        {
                          type: 'modify',
                          path: './src/assets/css/print.scss',
                          pattern: /(\s+)(\/\/\*autoinsertatom\*)/m,
                          template: `$1@import '../../atoms/${fileName}/${fileName}.print';$1$2`,
                          abortOnFail: true,
                        },
                      ]
                    : []
                );
              case 'Rename':
              case 'Remove':
                return [
                  {
                    type: 'modify',
                    path: './src/assets/css/main.scss',
                    pattern: new RegExp(
                      `(\\s+)?@import '../../atoms/${answers.fileName}/${answers.fileName}';`,
                      'm'
                    ),
                    template: isRemove ? '' : `$1@import '../../atoms/${fileName}/${fileName}';`,
                    abortOnFail: true,
                  },
                ].concat(
                  hasPrintCss
                    ? [
                        {
                          type: 'modify',
                          path: './src/assets/css/print.scss',
                          pattern: new RegExp(
                            `(\\s+)?@import '../../atoms/${answers.fileName}/${answers.fileName}.print';`,
                            'm'
                          ),
                          template: isRemove
                            ? ''
                            : `$1@import '../../atoms/${fileName}/${fileName}.print';`,
                          abortOnFail: true,
                        },
                      ]
                    : []
                );
              default:
                return [];
            }
          },
        },
      ],
    },
    env
  );

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

  const instance = task(
    {
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
        src: ['./src/**/*.{png,gif,jpg,woff,woff2,ttf,jpeg,html,json}'],
        name: 'copy',
      },
    },
    env
  );

  // Don't immediately run task when skipping build
  if (env.watch && env.skipBuild) {
    return instance;
  }

  return instance();
});

/**
 * Copy files for AEM
 * Copies files, optionally renames them.
 *
 * Using `--watch` (or manually setting `env` to `{ watch: true }`) starts file watcher
 * When combined with `--skipBuild`, the task will not run immediately but only after changes
 */
_task('copy:aem', () => {
  const task = require('@unic/estatico-copy');

  const instance = task(
    {
      src: [
        './dist/assets/**/*.{css,js,svg,json,woff2}',
        './dist/assets/fonts/*',
        './dist/assets/media/icons/*',
        './dist/assets/media/pngsprite/*',
      ],
      srcBase: './dist/assets',
      dest: env.aemTargetBaseResources,
      plugins: {
        changed: null,
        rename: (filePath) => {
          let returnPath = filePath;

          if (filePath.match(/manifest\.json/)) {
            return returnPath;
          }

          if (filePath.match(/\.min\.js/)) {
            returnPath = returnPath.replace(/\.min\.js/, `.${short()}.min.js`);
          } else if (filePath.match(/\.js/)) {
            returnPath = returnPath.replace(/\.js/, `.${short()}.js`);
          }

          if (filePath.match(/\.min\.css/)) {
            returnPath = returnPath.replace(/\.min\.css/, `.${short()}.min.css`);
          } else if (filePath.match(/\.css/)) {
            returnPath = returnPath.replace(/\.css/, `.${short()}.css`);
          }

          if (filePath.match(/\.svg/)) {
            returnPath = returnPath.replace(/\.svg/, `.${short()}.svg`);
          }

          return returnPath;
        },
      },
    },
    env
  );

  return instance();
});

/**
 * Clean AEM Assets
 */
_task('clean:aem', () => {
  return rm(env.aemTargetBaseResources, { recursive: true, force: true });
});

/**
 * Create dev and prod build directories
 * Copies specific files into `dist/ci/dev` and `dist/ci/prod`, respectively
 */
_task('copy:ci', () => {
  const task = require('@unic/estatico-copy');
  const merge = require('merge-stream');

  const dev = task(
    {
      src: [
        './dist/**/*',
        '!./dist/ci/**/*',
        '!./dist/**/*.min.*',
        '!./dist/**/*.html',
        './dist/**/*.mock.html',
        './dist/**/*.dev.html',
      ],
      srcBase: './dist',
      dest: './dist/ci/dev',
      plugins: {
        changed: null,
        rename: (filePath) => {
          // The `html` task creates dev versions with a `.dev.html` extension
          // They need to be renamed to `.html`
          if (filePath.match(/\.dev\.html/)) {
            return filePath.replace(/\.dev\.html/, '.html');
          }

          return filePath;
        },
      },
    },
    env
  );

  const prod = task(
    {
      src: [
        './dist/**/*',
        '!./dist/assets/js/*',
        '!./dist/assets/css/*',
        './dist/assets/js/*.min.*',
        './dist/assets/css/*.min.*',
        '!./dist/ci/**/*',
        '!./dist/**/*.dev.html',
      ],
      srcBase: './dist',
      dest: './dist/ci/prod',
      plugins: {
        changed: null,
      },
    },
    env
  );

  // perserve .content.xml file in resource folder
  const contentXML = task(
    {
      src: [`${env.aemTargetBaseResources}../css/.content.xml`],
      srcBase: `${env.aemTargetBaseResources}../css/`,
      dest: env.aemTargetBaseResources,
    },
    env
  );

  if (env.aemPresent) {
    return merge(dev(), prod(), contentXML());
  }
  return merge(dev(), prod());
});

/**
 * Clean build directory
 */
_task('clean', () => {
  return Promise.all([
    rm('./dist', { recursive: true, force: true }),
    rm('./www', { recursive: true, force: true }),
    rm('./src/assets/.tmp', { recursive: true, force: true }),
  ]);
});

/**
 * Deploy offline page
 */
_task('deploy:offlinepage', () =>
  Inlinify('./dist/pages/pagedownerror/pagedownerror.html', './dist/ci/offline/', 'index.html')
);

/**
 * Inlinify E-Mail assets
 */
_task('email:inlineassets', () => Inlinify('./dist/pages/mail/mail.html'));

/**
 * Build app archetype
 */
_task(
  'app:archetype',
  series(
    'clean',
    'media:svgsprite',
    'app:archetype:subset',
    'app:archetype:hbs',
    'app:archetype:copy',
    'app:archetype:pack',
    'app:archetype:clean'
  )
);

/**
 * Zip deployment package
 */
_task('zip', () => _src(['dist/ci/prod/**/*']).pipe(zip('deploy.zip')).pipe(_dest('dist/ci')));

/**
 * Zip offline package
 */
_task('zip:offline', () =>
  _src('dist/ci/offline/**/*').pipe(zip('offline.zip')).pipe(_dest('dist'))
);

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
_task('build', async (done) => {
  let task = parallel('html', 'js', 'js:mocks', 'media:svgsprite', 'copy', 'css');
  let readEnv = new Promise((resolve) => {
    resolve();
  });

  if (env.ci) {
    const lintTask = parallel('css:lint', 'js:lint');
    try {
      await new Promise((resolve, reject) => {
        lintTask((error) => {
          if (error) {
            console.error('Linting failed on CI, build will fail');
            env.skipLinting = false;
            reject(error);
          } else {
            console.log('Linting passed on CI');
            env.skipLinting = true;
            resolve();
          }
        });
      });
    } catch (error) {
      done(error);
      return;
    }
  }

  // Clean first
  if (!env.skipBuild) {
    task = series('clean', 'clean:aem', task);
  }

  // create offline page & inlinfify assets
  task = series(task, 'email:inlineassets');

  // Create CI build structure
  if (env.ci) {
    if (env.aemPresent) {
      task = series(task, 'copy:ci', 'copy:aem', 'deploy:aem', 'zip');
    } else {
      task = series(task, 'copy:ci', 'zip');
    }
  }

  if (env.watch && !env.skipBuild && !env.noInteractive && !env.skipLinting && !env.ci) {
    readEnv = inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'skipLinting',
          message: 'Do you want to skip linting?',
          default: false,
        },
      ])
      .then((answers) => {
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
  let readEnv = new Promise((resolve) => {
    resolve();
  });

  if (env.watch && !env.noInteractive && !env.skipBuild) {
    readEnv = inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'skipBuild',
          message: 'Do you want to skip the build before starting the server?',
          default: false,
        },
      ])
      .then((answers) => {
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
