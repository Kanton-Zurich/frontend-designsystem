const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const gulpRename = require('gulp-rename');
const strReplace = require('gulp-string-replace');
const through = require('through2');

const mimeTypes = {
  png: 'data:image/png;base64,',
  jpg: 'data:image/jpg;base64,',
  jpeg: 'data:image/jpeg;base64,',
  gif: 'data:image/gif;base64,',
  ico: 'data:image/ico;base64,',
};

const loadFileFromLocationSync = (url, options = null) => {
  const staticBasePath = './dist';
  const resolvedBase = path.resolve(staticBasePath);
  const safeSuffix = path.normalize(url).replace(/^(\.\.[/\\])+/, '');
  const fileLoc = path.join(resolvedBase, safeSuffix);

  return fs.readFileSync(fileLoc, options);
};

const Inlinify = (srcFile, destination = false, rename = false) => {
  const linkRegex = /(href|src)="[^\s]+assets[^\s]+(png|jpg|jpeg|ico)"/g;
  const manifestRegex = /rel="manifest".+(href|src)="[^\s]+assets[^\s]+json"/g;
  const jsRegex = /<script.+src="[^\s]+assets[^\s]+js".+<\/script>/g;
  const cssRegex = /<link.+href="[^\s]+assets[^\s]+css".*>/g;
  const svgRegex = /<!--svg href="[^\s]+"-->/g;
  const imgSvgRegex = /src="[^\s]+assets[^\s]+(svg)"/g;
  const srcsetRegex = /srcset="[^"]+"/g;
  const dest = destination || `${path.dirname(srcFile)}/`;
  const fileName = rename || path.basename(srcFile);

  return gulp
    .src(srcFile)
    .pipe(
      through.obj((chunk, enc, cb) => {
        cb(null, chunk);
      })
    )
    .pipe(
      strReplace(linkRegex, (match) => {
        const target = match.split('"')[0];
        const url = match.split('"')[1];
        const mimeType = url.split('.').pop();
        const base64Header = mimeTypes[mimeType];
        const fileContent = Buffer.from(loadFileFromLocationSync(url));
        if (base64Header) {
          return `${target}"${base64Header}${fileContent.toString('base64')}"`;
        }
        return match;
      })
    )
    .pipe(strReplace(srcsetRegex, () => ''))
    .pipe(
      strReplace(cssRegex, (match) => {
        const url = match.split('"')[3];
        const fileContent = loadFileFromLocationSync(url, 'utf-8');

        return `<style type="text/css">${fileContent}</style>`;
      })
    )
    .pipe(
      strReplace(svgRegex, (match) => {
        const url = match.split('&quot;')[1];
        return loadFileFromLocationSync(url, 'utf-8');
      })
    )
    .pipe(
      strReplace(jsRegex, (match) => {
        const params = match
          .match(/<script[^<]+>/g)[0]
          .match(/[^\s<]+([^\s>]+|="[^"]+")/g)
          .filter((param) => param.indexOf('src=') < 0);
        const url = match.split('"')[1];
        const fileContent = loadFileFromLocationSync(url, 'utf-8');
        return `<${params.join(' ')}>${fileContent}</${params[0]}>`;
      })
    )
    .pipe(
      strReplace(imgSvgRegex, (match) => {
        const url = match.split('"')[1];
        const header = 'data:image/svg+xml;utf8,';
        const fileContent = loadFileFromLocationSync(url, 'utf-8');
        return `src="${header}${encodeURIComponent(fileContent)}"'"`;
      })
    )
    .pipe(
      strReplace(manifestRegex, (match) => {
        const url = match.split('"')[3];
        const header = 'data:application/manifest+json,';
        const fileContent = loadFileFromLocationSync(url, 'utf-8');
        return `rel="manifest" href='${header}${fileContent.replace(/\r?\n|\r/g, '')}'`;
      })
    )
    .pipe(gulpRename(fileName))
    .pipe(gulp.dest(dest));
};

module.exports.Inlinify = Inlinify;
