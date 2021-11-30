const gulp = require('gulp');
const zip = require('gulp-zip');
const env = require('minimist')(process.argv.slice(2));
const hbsTask = require('@unic/estatico-handlebars');
const copyTask = require('@unic/estatico-copy');

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
      './dist/assets/css/main.css',
      './dist/assets/css/main.min.css',
      './dist/assets/css/fonts.css',
      './dist/assets/css/fonts.min.css',
      './dist/assets/css/print.css',
      './dist/assets/css/print.min.css',
      './dist/assets/media/svgsprite/base.svg',
      './dist/assets/media/svgsprite/base.svg',
    ],
    srcBase: './dist',
    dest: './dist/app_archetype',
  }, env)();

});

gulp.task('app:archetype:pack', () => gulp.src(['dist/app_archetype/**/*'])
  .pipe(zip('app_archetype.zip'))
  .pipe(gulp.dest('dist/')));
