const gulp = require('gulp');
const zip = require('gulp-zip');
const env = require('minimist')(process.argv.slice(2));
const hbsTask = require('@unic/estatico-handlebars');
const copyTask = require('@unic/estatico-copy');
const jsTask = require('@unic/estatico-webpack');
const sassTask = require('@unic/estatico-sass');
const nodeSassJsonImporter = require('node-sass-json-importer');
const { readFileSyncCached } = require('@unic/estatico-utils');
const fs = require('fs');
const nodeSass = require('node-sass');
const inquirer = require('inquirer');

gulp.task('app:archetype:js', (cb) => {
  const webpackConfig = require('../tmp-webpack.config.js');

  const instance = jsTask(defaults => ({
    webpack: webpackConfig,
    logger: defaults.logger,
  }), env);

  return instance(cb);
});

gulp.task('app:archetype:css', () => {
  const instance = sassTask({
    src: [
      './src/assets/css/tmp-main.scss',
      './src/assets/css/fonts.scss',
      './src/assets/css/print.scss',
    ],
    srcBase: './src/',
    dest: './dist',
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
            const buffer = new Buffer($string.getValue());
            return nodeSass.types.String(buffer.toString('base64'));
          },
        },
      },

    },
  }, env);

  return instance();
});

gulp.task('app:archetype:subset', (done) => {
  const task = gulp.parallel(
    'app:archetype:js',
    'app:archetype:css',
  );

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


  inquirer
    .prompt([
      {
        type: 'checkbox',
        name: 'atoms',
        message: 'Which atoms shall be included? (Press <space> to select, <a> to toggle all, <i> to invert selection)',
        choices: atoms,
        default: atoms,
      },
      {
        type: 'checkbox',
        name: 'modules',
        message: 'Which modules shall be included? (Press <space> to select, <a> to toggle all, <i> to invert selection)',
        choices: modules,
        default: modules,
      },
    ])
    .then(answers => {
      lineArraySCSS.forEach((line) => {
        if (line.match(/\/modules\/[A-Za-z_\-0-9]*\//g)) {
          if (answers.modules.find((mdl) => {
            const rgx = new RegExp(`\/modules\/${mdl}*`);
            return line.match(rgx);
          })) {
            scssSubset.push(line);
          }
          return;
        }
        if (line.match(/\/atoms\/[A-Za-z_\-0-9]*\//g)) {
          if (answers.atoms.find((atm) => {
            const rgx = new RegExp(`\/atoms\/${atm}*`);
            return line.match(rgx);
          })) {
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
        if (moduleReferencesToRemove.find((ref) => {
          const regexRef = new RegExp(`this\.modules.*${ref}\;`);
          return line.match(regexRef);
        })) return;
        jsSubset.push(line);
      });
      fs.writeFileSync('src/assets/js/helpers/tmp-app.ts', jsSubset.join('\n'));
      fs.writeFileSync('src/assets/css/tmp-main.scss', scssSubset.join('\n'));
      const webpackFile = readFileSyncCached('./webpack.config.js').toString().replace('main: \'./src/assets/js/main.ts\',', 'main: \'./src/assets/js/tmp-main.ts\',');
      const mainFile = readFileSyncCached('./src/assets/js/main.ts').toString().replace('import App from \'./helpers/app\';', 'import App from \'./helpers/tmp-app\';');
      fs.writeFileSync('./tmp-webpack.config.js', webpackFile);
      fs.writeFileSync('src/assets/js/tmp-main.ts', mainFile);
      task(done);
    });
});

gulp.task('app:archetype:clean', (cb) => {
  const del = require('del');

  return del([
    'src/assets/js/helpers/tmp-app.ts',
    'src/assets/css/tmp-main.scss',
    './tmp-webpack.config.js',
    'src/assets/js/tmp-main.ts',
  ], { force: true }, cb);
});

gulp.task('app:archetype:hbs', () => {
  return hbsTask({
    src: [
      './src/layouts/application_layout/*.hbs',
    ],
    srcBase: './src/layouts/application_layout/',
    dest: './dist/app_archetype/',
    plugins: {
      handlebars: {
        partials: [
          './src/**/*.hbs',
        ],
        helpers: [
          './gulp/helpers/*.js',
        ],
      },
    },
  })();
});

gulp.task('app:archetype:copy', () => {
  copyTask({
    src: [
      './src/layouts/application_layout/script.js',
      './src/layouts/application_layout/style.css',
    ],
    srcBase: './src/layouts/application_layout/',
    dest: './dist/app_archetype',
  }, env)();

  return copyTask({
    src: [
      './dist/assets/js/head.js',
      './dist/assets/js/head.min.js',
      './dist/assets/js/main.js',
      './dist/assets/js/main.min.js',
      './dist/assets/css/tmp-main.css',
      './dist/assets/css/tmp-main.min.css',
      './dist/assets/css/fonts.css',
      './dist/assets/css/fonts.min.css',
      './dist/assets/css/print.css',
      './dist/assets/css/print.min.css',
      './dist/assets/media/svgsprite/base.svg',
      './dist/assets/media/svgsprite/base.svg',
    ],
    srcBase: './dist',
    dest: './dist/app_archetype',
    plugins: {
      rename: filePath => filePath.replace('/tmp-', '/'),
    },
  }, env)();

});

gulp.task('app:archetype:pack', () => gulp.src(['dist/app_archetype/**/*'])
  .pipe(zip('app_archetype.zip'))
  .pipe(gulp.dest('dist/')));
