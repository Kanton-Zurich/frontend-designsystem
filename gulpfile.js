/* eslint-disable global-require */
const gulp = require('gulp');
const zip = require('gulp-zip');
const path = require('path');
const fs = require('fs');
const process = require('process');
const env = require('minimist')(process.argv.slice(2));
const git = require('git-rev-sync');
const nodeSass = require('node-sass');
const gulpUtil = require('gulp-util');
const helperFunctions = require('./gulp/_functions');
require('./gulp/deploy-aem');
require('./gulp/app-archetype');

gulpUtil.env.aemTargetBase = '../czhdev-backend/sources/zhweb-core/zhweb-core-content/src/main/resources/jcr_root/apps/zhweb/core/';
gulpUtil.env.aemTargetBaseResources = `${gulpUtil.env.aemTargetBase}clientlibs/publish/resources/`;
gulpUtil.env.aemAssetsProxy = '/etc.clientlibs/zhweb/core/clientlibs/publish/resources/';
gulpUtil.env.revision = `.${git.short()}`;
gulpUtil.env.aemPresent = false;

try {
  if (fs.existsSync(gulpUtil.env.aemTargetBaseResources)) {
    gulpUtil.env.aemPresent = true;
  } else {
    console.log('AEM not present for deployment, skipping deployment of assets');
  }
} catch (err) {
  console.log('AEM not present for deployment, skipping deployment of assets');
}

/**
 * HTML task
 * Transforms Handlebars to HTML
 *
 * Using `--watch` (or manually setting `env` to `{ watch: true }`) starts file watcher
 * When combined with `--skipBuild`, the task will not run immediately but only after changes
 */
gulp.task('html', () => {
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

              let resolvedPath = path.resolve('./src', match[1]);

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

              return path.resolve(path.dirname(filePath), match[1] || match[2]);
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
        let relPathPrefix = path.join(path.relative(file.path, './src'));
        if (path.basename(file.path) !== 'scaffolding.hbs') {
          relPathPrefix = relPathPrefix
            .replace(new RegExp(`\\${path.sep}g`), '/') // Normalize path separator
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
 * HTML validation task
 * Sends HTML pages through the [w3c validator](https://validator.w3.org/).
 *
 * Using `--watch` (or manually setting `env` to `{ watch: true }`) starts file watcher
 * When combined with `--skipBuild`, the task will not run immediately but only after changes
 */
gulp.task('html:validate', () => {
  const task = require('@unic/estatico-w3c-validator');

  const instance = task({
    src: [
      './dist/*.html',
      './dist/modules/**/*.html',
      './dist/pages/**/*.html',
      './dist/atoms/**/*.html',
    ],
    srcBase: './dist/',
    watch: {
      src: [
        './dist/*.html',
        './dist/modules/**/*.html',
        './dist/pages/**/*.html',
        './dist/atoms/**/*.html',
      ],
      name: 'html:validate',
    },
  }, env);

  // Don't immediately run task when skipping build
  if (env.watch && env.skipLinting) {
    return instance;
  }

  return instance();
});

/**
 * Lint data file structure
 * Uses Ajv to to validate against a JSON schema
 *
 * Using `--watch` (or manually setting `env` to `{ watch: true }`) starts file watcher
 * When combined with `--skipBuild`, the task will not run immediately but only after changes
 */
gulp.task('data:lint', () => {
  const task = require('@unic/estatico-json-schema');
  const estaticoWatch = require('@unic/estatico-watch');
  const instance = task({
    src: [
      './src/**/*.data.js',
    ],
    srcBase: './src',
    watch: {
      src: [
        './src/**/*.data.js',
        './src/**/*.schema.json',
      ],
      name: 'data:lint',
      dependencyGraph: {
        srcBase: './',
        resolver: {
          js: {
            match: /(?:require\('(.*?\.data\.js)'\)|require\('(.*?\.schema\.json))/g,
            resolve: (match, filePath) => {
              if (!(match[1] || match[2])) {
                return null;
              }
              return path.resolve(path.dirname(filePath), match[1] || match[2]);
            },
          },
          json: {},
        },
      },
      watcher: estaticoWatch,
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
gulp.task('css', () => {
  const task = require('@unic/estatico-sass');
  const estaticoWatch = require('@unic/estatico-watch');
  const nodeSassJsonImporter = require('node-sass-json-importer');

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
                path.dirname(filePath),
                './src/',
                './src/assets/css/',
              ].map((dir) => {
                const partialPath = match[1].replace(path.basename(match[1]), `_${path.basename(match[1])}`);
                const candidatePath = path.resolve(dir, match[1]);
                const candidatePartialPath = path.resolve(dir, partialPath);
                const candidatePaths = [
                  candidatePath,
                  candidatePartialPath,
                  // .scss extension
                  path.extname(candidatePath) ? candidatePath : `${candidatePath}.scss`,
                  path.extname(candidatePartialPath) ? candidatePartialPath : `${candidatePartialPath}.scss`,
                  // .css extension
                  path.extname(candidatePath) ? candidatePath : `${candidatePath}.css`,
                ];
                if (path.extname(candidatePath) === '.print') {
                  candidatePaths.push(`${candidatePath}.scss`);
                }

                // Remove duplicates
                return [...new Set(candidatePaths)];
              }).reduce((arr, curr) => arr.concat(curr), []); // Flatten

              return candidates.find((candidatePath) => { // eslint-disable-line arrow-body-style
                // Ignore inexistent files
                return fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile();
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
        importer: [
          // Add importer being able to deal with json files like colors, e.g.
          nodeSassJsonImporter,
        ],
        functions: {
          'encode_Base64($string)': function ($string) {
            var buffer = new Buffer($string.getValue());
            return nodeSass.types.String(buffer.toString('base64'));
          },
        },
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
gulp.task('css:lint', () => {
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
 * CSS font inlining task
 * Uses `gulp-simplefont64` to inline font files into base64-encoded data URIs
 *
 * Using `--watch` (or manually setting `env` to `{ watch: true }`) starts file watcher
 * When combined with `--skipBuild`, the task will not run immediately but only after changes
 */
gulp.task('css:fonts', () => {
  const task = require('@unic/estatico-font-datauri');

  const instance = task({
    src: [
      './src/assets/fonts/**/*',
    ],
    dest: './src/assets/.tmp',
    plugins: {
      concat: 'fonts.scss',
    },
    watch: {
      src: [
        './src/assets/fonts/**/*',
      ],
      name: 'css:fonts',
    },
  }, env);

  // Don't immediately run task when skipping build
  if (env.watch && env.skipBuild) {
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
gulp.task('js', (cb) => {
  const task = require('@unic/estatico-webpack');
  const webpackConfig = require('./webpack.config.js');

  const instance = task(defaults => ({
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
gulp.task('js:lint', () => {
  const task = require('./gulp/estatico-eslint-2.js');

  const instance = task({
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
gulp.task('js:mocks', () => {
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
gulp.task('media:svgsprite', () => {
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
 * Generate image versions
 * Uses GraphicsMagick to create resized and optionally cropped image variants
 *
 * Using `--watch` (or manually setting `env` to `{ watch: true }`) starts file watcher
 * When combined with `--skipBuild`, the task will not run immediately but only after changes
 */
gulp.task('media:imageversions', () => {
  const task = require('@unic/estatico-imageversions');

  const instance = task({
    src: [
      './src/**/imageversions.config.js',
    ],
    srcBase: './src',
    dest: './dist/',
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
gulp.task('serve', () => {
  const task = require('@unic/estatico-browsersync');

  const instance = task({
    plugins: {
      browsersync: {
        server: './dist',
        watch: './dist/**/*.{html,css,js}',
      },
    },
  }, env);

  return instance();
});

/**
 * Scaffolding task
 * Uses `node-plop` to interactively scaffold files.
 */
gulp.task('scaffold', () => {
  const task = require('@unic/estatico-scaffold');

  const transformModuleInput = (answers) => {
    const changeCase = require('change-case');
    const name = answers.newName || answers.name;

    return Object.assign({}, answers, {
      [answers.newName ? 'newFileName' : 'fileName']: changeCase.snake(path.basename(name)),
      [answers.newName ? 'newClassName' : 'className']: changeCase.pascal(path.basename(name)),
      [answers.newName ? 'newModuleName' : 'moduleName']: changeCase.camel(path.basename(name)),
    });
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
          const hasJs = answers.files ? answers.files.find(file => file.match(/{{fileName}}\.ts/)) : true;
          const hasCss = answers.files ? answers.files.find(file => file.match(/{{fileName}}\.scss/)) : true;
          const hasPrintCss = answers.files ? answers.files.find(file => file.match(/{{fileName}}\.print.scss/)) : true;

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

          return Object.assign({}, answers, {
            [answers.newName ? 'newFileName' : 'fileName']: changeCase.snake(path.basename(name)),
          });
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
          const hasPrintCss = answers.files ? answers.files.find(file => file.match(/{{fileName}}\.print.scss/)) : true;

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
gulp.task('copy', () => {
  const task = require('@unic/estatico-copy');

  const instance = task({
    src: [
      './src/**/*.{png,gif,jpg,woff,ttf,jpeg,zip}',
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
        './src/**/*.{png,gif,jpg,woff,ttf,jpeg,json}',
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
 * Copy files for AEM
 * Copies files, optionally renames them.
 *
 * Using `--watch` (or manually setting `env` to `{ watch: true }`) starts file watcher
 * When combined with `--skipBuild`, the task will not run immediately but only after changes
 */
gulp.task('copy:aem', () => {
  const task = require('@unic/estatico-copy');

  const instance = task({
    src: [
      './dist/assets/**/*.{css,js,svg,json}',
      './dist/assets/media/icons/*',
      './dist/assets/media/pngsprite/*',
    ],
    srcBase: './dist/assets',
    dest: gulpUtil.env.aemTargetBaseResources,
    plugins: {
      changed: null,
      rename: (filePath) => {
        let returnPath = filePath;

        if (filePath.match(/manifest\.json/)) {
          return returnPath;
        }

        if (filePath.match(/\.min\.js/)) {
          returnPath = returnPath.replace(/\.min\.js/, `.${git.short()}.min.js`);
        } else if (filePath.match(/\.js/)) {
          returnPath = returnPath.replace(/\.js/, `.${git.short()}.js`);
        }

        if (filePath.match(/\.min\.css/)) {
          returnPath = returnPath.replace(/\.min\.css/, `.${git.short()}.min.css`);
        } else if (filePath.match(/\.css/)) {
          returnPath = returnPath.replace(/\.css/, `.${git.short()}.css`);
        }

        if (filePath.match(/\.svg/)) {
          returnPath = returnPath.replace(/\.svg/, `.${git.short()}.svg`);
        }

        return returnPath;
      },
    },
  }, env);

  return instance();
});

/**
 * Clean AEM Assets
 */
gulp.task('clean:aem', (callback) => {
  const del = require('del');

  return del(gulpUtil.env.aemTargetBaseResources, { force: true }, callback);
});

/**
 * Create dev and prod build directories
 * Copies specific files into `dist/ci/dev` and `dist/ci/prod`, respectively
 */
gulp.task('copy:ci', () => {
  const task = require('@unic/estatico-copy');
  const merge = require('merge-stream');

  const dev = task({
    src: [
      './dist/**/*',
      '!./dist/ci/**/*',
      '!./dist/**/*.min.*',
      '!./dist/**/*.html',
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
  }, env);

  const prod = task({
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
  }, env);


  // perserve .content.xml file in resource folder
  const contentXML = task({
    src: [
      `${gulpUtil.env.aemTargetBaseResources}../css/.content.xml`,
    ],
    srcBase: `${gulpUtil.env.aemTargetBaseResources}../css/`,
    dest: gulpUtil.env.aemTargetBaseResources,
  }, env);

  if (gulpUtil.env.aemPresent) {
    return merge(dev(), prod(), contentXML());
  }
  return merge(dev(), prod());
});

/**
 * Clean build directory
 */
gulp.task('clean', () => {
  const del = require('del');
  return del(['./dist', './www', './src/assets/.tmp']);
});

/**
 * Deploy offline page
 */
gulp.task('deploy:offlinepage', () => {
  return helperFunctions.Inlinify('./dist/pages/pagedownerror/pagedownerror.html', './dist/ci/offline/', 'index.html');
});

/**
 * Inlinify E-Mail assets
 */
gulp.task('email:inlineassets', () => {
  return helperFunctions.Inlinify('./dist/pages/mail/mail.html');
});

/**
 * Build app archetype
 */
gulp.task('app:archetype', gulp.series('clean', 'media:svgsprite', 'app:archetype:subset', 'app:archetype:hbs', 'app:archetype:copy', 'app:archetype:pack', 'app:archetype:clean'));

/**
 * Zip deployment package
 */
gulp.task('zip', () => gulp.src(['dist/ci/prod/**/*'])
  .pipe(zip('deploy.zip'))
  .pipe(gulp.dest('dist/ci')));

/**
 * Zip offline package
 */
gulp.task('zip:offline', () => gulp.src('dist/ci/offline/**/*')
  .pipe(zip('offline.zip'))
  .pipe(gulp.dest('dist')));


/**
 * Lint / validate
 */
gulp.task('lint', gulp.parallel('css:lint', 'js:lint', 'data:lint'));

/**
 * Create complete build
 * Prompts whether linting should run when in --watch mode
 *
 * --noInteractive / --skipLinting will bypass the prompt
 * --ci will create complete builds in `dist/ci/dev` and `dist/ci/prod` directories
 */
gulp.task('build', (done) => {
  let task = gulp.parallel(
    'html',
    'js',
    'js:mocks',
    'media:svgsprite',
    'media:imageversions',
    'copy',
    // When starting watcher without building, "css:fonts" will never finish
    // In order for "css" to still run properly, we switch from serial to parallel execution
    (env.watch && env.skipBuild) ? gulp.parallel('css') : gulp.series('css'),
  );
  let readEnv = new Promise(resolve => resolve());

  // Clean first
  if (!env.skipBuild) {
    task = gulp.series('clean', 'clean:aem', task);
  }

  // create offline page & inlinfify assets
  task = gulp.series(task, 'email:inlineassets');

  // Create CI build structure
  if (env.ci) {
    if (gulpUtil.env.aemPresent) {
      task = gulp.series(task, 'copy:ci', 'copy:aem', 'deploy:aem', 'zip');
    } else {
      task = gulp.series(task, 'copy:ci', 'zip');
    }
  }

  if (env.watch && (!env.skipBuild && !env.noInteractive && !env.skipLinting && !env.ci)) {
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
        task = gulp.parallel(task, 'lint');
      } else {
        task = gulp.series(task, gulp.parallel('lint'));
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
gulp.task('default', (done) => {
  let readEnv = new Promise(resolve => resolve());

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

      return gulp.parallel('build', 'serve')(done);
    }

    return gulp.series('build', 'serve')(done);
  });
});
