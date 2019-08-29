const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const gulpRename = require('gulp-rename');
const strReplace = require('gulp-string-replace');
const through = require('through2');

const task = {
  name: 'deploy:offlinepage',
};

gulp.task(task.name, () => {
  const regxSVG = /\.\.\/\.\.\/assets\/media\/svgsprite\/base.*?\.svg/g;
  const regxMainMin = /\.\.\/\.\.\/assets\/css\/main.*?\.min\.css/g;
  const regxPrintMin = /\.\.\/\.\.\/assets\/css\/print.*?\.min\.css/g;
  const regxFontsMin = /\.\.\/\.\.\/assets\/css\/fonts.*?\.min\.css/g;
  const regxMainJSMin = /\.\.\/\.\.\/assets\/js\/main.*?\.min\.js/g;
  const regxHeadJSMin = /\.\.\/\.\.\/assets\/js\/head.*?\.min\.js/g;

  const destination = './dist/ci/offline/';

  return gulp.src('./dist/pages/pagedownerror/pagedownerror.html')
    .pipe(through.obj((chunk, enc, cb) => {
      console.log('Changed paths in file: ', chunk.path);
      cb(null, chunk);
    }))
    .pipe(strReplace(regxSVG, () => `assets/media/svgsprite/base${gulpUtil.env.revision}.svg`))
    .pipe(strReplace(regxMainMin, () => `assets/css/main${gulpUtil.env.revision}.min.css`))
    .pipe(strReplace(regxFontsMin, () => `assets/css/fonts${gulpUtil.env.revision}.min.css`))
    .pipe(strReplace(regxPrintMin, () => `assets/css/print${gulpUtil.env.revision}.min.css`))
    .pipe(strReplace(regxMainJSMin, () => `assets/js/main${gulpUtil.env.revision}.min.js`))
    .pipe(strReplace(regxHeadJSMin, () => `assets/js/head${gulpUtil.env.revision}.min.js`))
    .pipe(gulpRename('index.html'))
    .pipe(gulp.dest(destination));
});
