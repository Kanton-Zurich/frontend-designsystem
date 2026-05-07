import { createRequire } from 'module';
import gulp from 'gulp';
import strReplace from 'gulp-string-replace';
import { obj } from 'through2';
import { argv } from 'process';

const require = createRequire(import.meta.url);
const { short } = require('git-rev-sync');

const { task: _task, src, dest } = gulp;

// eslint-disable-next-line no-magic-numbers
const env = require('minimist')(argv.slice(2));

env.watch = env.watchgulp;
env.aemTargetBase =
  '../czhdev-backend/sources/zhweb-core/zhweb-core-content/src/main/resources/jcr_root/apps/zhweb/core/';
env.aemTargetBaseResources = `${env.aemTargetBase}clientlibs/publish/resources/`;
env.aemAssetsProxy = '/etc.clientlibs/zhweb/core/clientlibs/publish/resources/';
env.revision = `.${short()}`;
env.aemPresent = true;

const task = {
  name: 'deploy:aem',
};

_task(task.name, () => {
  const regxSVG = /resources\/media\/svgsprite\/base\..*?\.svg/g;
  const regxMain = /resources\/css\/main\..*?\.css/g;
  const regxMainMin = /resources\/css\/main\..*?\.min\.css/g;
  const regxPrint = /resources\/css\/print\..*?\.css/g;
  const regxPrintMin = /resources\/css\/print\..*?\.min\.css/g;
  const regxMainJS = /resources\/js\/main\..*?\.js/g;
  const regxMainJSMin = /resources\/js\/main\..*?\.min\.js/g;
  const regxHeadJS = /resources\/js\/head\..*?\.js/g;
  const regxHeadJSMin = /resources\/js\/head\..*?\.min\.js/g;

  const destinationPagesAEM = `${env.aemTargetBase}pages/`;

  src(`${env.aemTargetBase}clientlibs/publish/resources/manifest.json`, {
    base: `${env.aemTargetBase}clientlibs/`,
  })
    .pipe(strReplace('media/icons/', `${env.aemAssetsProxy}media/icons/`))
    .pipe(dest(`${env.aemTargetBase}clientlibs/`));

  return src(`${destinationPagesAEM}**/*.html`, { base: destinationPagesAEM })
    .pipe(
      obj((chunk, enc, cb) => {
        console.log('Changed paths in file: ', chunk.path);
        cb(null, chunk);
      })
    )
    .pipe(strReplace(regxSVG, () => `resources/media/svgsprite/base${env.revision}.svg`))
    .pipe(strReplace(regxMainMin, () => `resources/css/main${env.revision}.min.css`))
    .pipe(strReplace(regxPrintMin, () => `resources/css/print${env.revision}.min.css`))
    .pipe(strReplace(regxMainJSMin, () => `resources/js/main${env.revision}.min.js`))
    .pipe(strReplace(regxHeadJSMin, () => `resources/js/head${env.revision}.min.js`))
    .pipe(
      strReplace(regxMain, (found) => {
        if (found.search('.min.') >= 0) {
          return found;
        }
        return `resources/css/main${env.revision}.css`;
      })
    )
    .pipe(
      strReplace(regxPrint, (found) => {
        if (found.search('.min.') >= 0) {
          return found;
        }
        return `resources/css/print${env.revision}.css`;
      })
    )
    .pipe(
      strReplace(regxMainJS, (found) => {
        if (found.search('.min.') >= 0) {
          return found;
        }
        return `resources/js/main${env.revision}.js`;
      })
    )
    .pipe(
      strReplace(regxHeadJS, (found) => {
        if (found.search('.min.') >= 0) {
          return found;
        }
        return `resources/js/head${env.revision}.js`;
      })
    )
    .pipe(dest(destinationPagesAEM));
});
