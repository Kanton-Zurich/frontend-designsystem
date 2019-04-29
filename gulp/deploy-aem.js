const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const strReplace = require('gulp-string-replace');
var through = require('through2');

const task = {
  name: 'deploy:aem',
};


gulp.task(task.name, () => {
  const regxSVG = /resources\/media\/svgsprite\/base\..*?\.svg/g;
  const regxCrit = /resources\/css\/critical\..*?\.css/g;
  const regxMain = /resources\/css\/main\..*?\.css/g;
  const regxMainMin = /resources\/css\/main\..*?\.min\.css/g;
  const regxPrint = /resources\/css\/print\..*?\.css/g;
  const regxPrintMin = /resources\/css\/print\..*?\.min\.css/g;
  const regxFonts = /resources\/css\/fonts\..*?\.css/g;
  const regxFontsMin = /resources\/css\/fonts\..*?\.min\.css/g;
  const regxMainJS = /resources\/js\/main\..*?\.js/g;
  const regxMainJSMin = /resources\/js\/main\..*?\.min\.js/g;
  const regxHeadJS = /resources\/js\/head\..*?\.js/g;
  const regxHeadJSMin = /resources\/js\/head\..*?\.min\.js/g;

  const destinationPagesAEM = `${gulpUtil.env.aemTargetBase}pages/`;

  return gulp.src(`${destinationPagesAEM}**/*.html`, { base: destinationPagesAEM })
    .pipe(through.obj((chunk, enc, cb) => {
      console.log('Changed paths in file: ', chunk.path);
      cb(null, chunk);
    }))
    .pipe(strReplace(regxSVG, () => `resources/media/svgsprite/base${gulpUtil.env.revision}.svg`))
    .pipe(strReplace(regxCrit, () => `resources/css/critical${gulpUtil.env.revision}.css`))
    .pipe(strReplace(regxMainMin, () => `resources/css/main${gulpUtil.env.revision}.min.css`))
    .pipe(strReplace(regxFontsMin, () => `resources/css/fonts${gulpUtil.env.revision}.min.css`))
    .pipe(strReplace(regxPrintMin, () => `resources/css/print${gulpUtil.env.revision}.min.css`))
    .pipe(strReplace(regxMainJSMin, () => `resources/js/main${gulpUtil.env.revision}.min.js`))
    .pipe(strReplace(regxHeadJSMin, () => `resources/js/head${gulpUtil.env.revision}.min.js`))
    .pipe(strReplace(regxMain, (found) => {
      if (found.search('.min.') >= 0) {
        return found;
      }
      return `resources/css/main${gulpUtil.env.revision}.css`;
    }))
    .pipe(strReplace(regxFonts, (found) => {
      if (found.search('.min.') >= 0) {
        return found;
      }
      return `resources/css/fonts${gulpUtil.env.revision}.css`;
    }))
    .pipe(strReplace(regxPrint, (found) => {
      if (found.search('.min.') >= 0) {
        return found;
      }
      return `resources/css/print${gulpUtil.env.revision}.css`;
    }))
    .pipe(strReplace(regxMainJS, (found) => {
      if (found.search('.min.') >= 0) {
        return found;
      }
      return `resources/js/main${gulpUtil.env.revision}.js`;
    }))
    .pipe(strReplace(regxHeadJS, (found) => {
      if (found.search('.min.') >= 0) {
        return found;
      }
      return `resources/js/head${gulpUtil.env.revision}.js`;
    }))
    .pipe(gulp.dest(destinationPagesAEM));
});
