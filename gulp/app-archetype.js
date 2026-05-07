/* eslint-disable global-require */
import { createRequire } from 'module';
import gulp from 'gulp';
import zip from 'gulp-zip';
import hbsTask from '@unic/estatico-handlebars';
import copyTask from '@unic/estatico-copy';
import jsTask from './estatico-webpack-2.js';
import sassTask from '@unic/estatico-sass';
import { readFileSyncCached } from '@unic/estatico-utils';
import { writeFileSync } from 'fs';
import { rm } from 'fs/promises';
import inquirer from 'inquirer';

const require = createRequire(import.meta.url);

const { prompt } = inquirer;

const { task: _task, parallel, src: _src, dest: _dest } = gulp;

// eslint-disable-next-line no-magic-numbers
const env = require('minimist')(process.argv.slice(2));

env.watch = env.watchgulp;

_task('app:archetype:js', (cb) => {
  // eslint-disable-next-line import/no-unresolved
  const webpackConfig = require('../tmp-webpack.config.js');

  const instance = jsTask(
    (defaults) => ({
      webpack: webpackConfig,
      logger: defaults.logger,
    }),
    env
  );

  return instance(cb);
});

_task('app:archetype:css', () => {
  const instance = sassTask(
    {
      src: ['./src/assets/css/tmp-main.scss', './src/assets/css/print.scss'],
      srcBase: './src/',
      dest: './dist',
      plugins: {
        sass: {
          includePaths: ['./src/', './src/assets/css/'],
          quietDeps: true,
          silenceDeprecations: ['import', 'legacy-js-api', 'if-function', 'global-builtin', 'color-functions'],
        },
      },
    },
    env
  );

  return instance();
});

_task('app:archetype:subset', (done) => {
  const task = parallel('app:archetype:js', 'app:archetype:css');

  const scssSubset = [];
  const jsSubset = [];
  const lineArraySCSS = readFileSyncCached('./src/assets/css/main.scss').toString().split('\n');
  const lineArrayJS = readFileSyncCached('./src/assets/js/helpers/app.ts').toString().split('\n');

  const modules = [];
  const atoms = [];
  lineArraySCSS.forEach((line) => {
    if (line.match(/\/modules\/[A-Za-z_\-0-9]*\//g)) {
      const match = line.match(/\/modules\/[A-Za-z_\-0-9]*\//g)[0];
      modules.push(match.split('/')[2]);
    }

    if (line.match(/\/atoms\/[A-Za-z_\-0-9]*\//g)) {
      const match = line.match(/\/atoms\/[A-Za-z_\-0-9]*\//g)[0];
      atoms.push(match.split('/')[2]);
    }
  });

  lineArrayJS.forEach((line) => {
    if (line.match(/\/modules\/[A-Za-z_\-0-9]*\//g)) {
      const match = line.match(/\/modules\/[A-Za-z_\-0-9]*\//g)[0];
      if (modules.indexOf(match.split('/')[2]) < 0) {
        modules.push(match.split('/')[2]);
      }
    }
  });

  prompt([
    {
      type: 'confirm',
      name: 'skipSubsetConfiguration',
      message:
        'Do you want to configure the included atomes & modules to be used in the archetype?',
      default: false,
    },
  ]).then((result) => {
    if (result.skipSubsetConfiguration === true) {
      prompt([
        {
          type: 'checkbox',
          name: 'atoms',
          message:
            'Which atoms shall be included? (Press <space> to select, <a> to toggle all, <i> to invert selection)',
          choices: atoms,
          default: atoms,
        },
        {
          type: 'checkbox',
          name: 'modules',
          message:
            'Which modules shall be included? (Press <space> to select, <a> to toggle all, <i> to invert selection)',
          choices: modules,
          default: modules,
        },
      ]).then((answers) => {
        lineArraySCSS.forEach((line) => {
          if (line.match(/\/modules\/[A-Za-z_\-0-9]*\//g)) {
            if (
              answers.modules.find((mdl) => {
                const rgx = new RegExp(`/modules/${mdl}*`);
                return line.match(rgx);
              })
            ) {
              scssSubset.push(line);
            }
            return;
          }
          if (line.match(/\/atoms\/[A-Za-z_\-0-9]*\//g)) {
            if (
              answers.atoms.find((atm) => {
                const rgx = new RegExp(`/atoms/${atm}*`);
                return line.match(rgx);
              })
            ) {
              scssSubset.push(line);
            }
            return;
          }
          scssSubset.push(line);
        });

        const moduleReferencesToRemove = [];
        lineArrayJS.forEach((line) => {
          const matchModules = line.match(/\/modules\/[A-Za-z_\-0-9]*\//g);
          if (matchModules) {
            if (answers.modules.indexOf(matchModules[0].split('/')[2]) >= 0) {
              jsSubset.push(line);
            } else {
              moduleReferencesToRemove.push(line.match(/import.*from/g)[0].split(' ')[1]);
            }
            return;
          }
          if (
            moduleReferencesToRemove.find((ref) => {
              const regexRef = new RegExp(`this\\.modules\\.*${ref};`);
              return line.match(regexRef);
            })
          )
            return;
          jsSubset.push(line);
        });
        writeFileSync('src/assets/js/helpers/tmp-app.ts', jsSubset.join('\n'));
        writeFileSync('src/assets/css/tmp-main.scss', scssSubset.join('\n'));
        const webpackFile = readFileSyncCached('./webpack.config.js')
          .toString()
          .replace("main: './src/assets/js/main.ts',", "main: './src/assets/js/tmp-main.ts',");
        const mainFile = readFileSyncCached('./src/assets/js/main.ts')
          .toString()
          .replace("import App from './helpers/app';", "import App from './helpers/tmp-app';");
        writeFileSync('./tmp-webpack.config.js', webpackFile);
        writeFileSync('src/assets/js/tmp-main.ts', mainFile);
        task(done);
      });
    } else {
      writeFileSync('src/assets/js/helpers/tmp-app.ts', lineArrayJS.join('\n'));
      writeFileSync('src/assets/css/tmp-main.scss', lineArraySCSS.join('\n'));
      const webpackFile = readFileSyncCached('./webpack.config.js').toString();
      const mainFile = readFileSyncCached('./src/assets/js/main.ts').toString();
      writeFileSync('./tmp-webpack.config.js', webpackFile);
      writeFileSync('src/assets/js/tmp-main.ts', mainFile);
      task(done);
    }
  });
});

_task('app:archetype:clean', () => {
  return Promise.all([
    rm('src/assets/js/helpers/tmp-app.ts', { force: true }),
    rm('src/assets/css/tmp-main.scss', { force: true }),
    rm('./tmp-webpack.config.js', { force: true }),
    rm('src/assets/js/tmp-main.ts', { force: true }),
  ]);
});

_task('app:archetype:hbs', () =>
  hbsTask({
    src: ['./src/layouts/application_layout/*.hbs'],
    srcBase: './src/layouts/application_layout/',
    dest: './dist/app_archetype/',
    plugins: {
      handlebars: {
        partials: ['./src/**/*.hbs'],
        helpers: ['./gulp/helpers/*.js'],
      },
    },
  })()
);

_task('app:archetype:copy', () => {
  copyTask(
    {
      src: [
        './src/layouts/application_layout/script.js',
        './src/layouts/application_layout/style.css',
      ],
      srcBase: './src/layouts/application_layout/',
      dest: './dist/app_archetype',
    },
    env
  )();

  return copyTask(
    {
      src: [
        './dist/assets/js/head.js',
        './dist/assets/js/head.min.js',
        './dist/assets/js/main.js',
        './dist/assets/js/main.min.js',
        './dist/assets/css/tmp-main.css',
        './dist/assets/css/tmp-main.min.css',
        './dist/assets/css/print.css',
        './dist/assets/css/print.min.css',
        './dist/assets/media/svgsprite/base.svg',
        './dist/assets/media/svgsprite/base.svg',
      ],
      srcBase: './dist',
      dest: './dist/app_archetype',
      plugins: {
        rename: (filePath) => filePath.replace('/tmp-', '/'),
      },
    },
    env
  )();
});

_task('app:archetype:pack', () =>
  _src(['dist/app_archetype/**/*']).pipe(zip('app_archetype.zip')).pipe(_dest('dist/'))
);
