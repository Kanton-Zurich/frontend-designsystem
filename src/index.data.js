const _ = require('lodash');
const defaultData = require('./data/default.data.js');
const defTopiclistData = require('./modules/topiclist/topiclist.data').variants.home.props;

// Get other pages
const mainMenu = _.merge({}, defTopiclistData, {
  topiclistInput: null,
  additionalClasses: 'sg_topiclist',
});

mainMenu.topiclistcontentNavData.items = [
  {
    shortTitle: 'User Experience',
    buzzwords: 'Nutzen, Barrierefreiheit, Inhalt, Usability, Technik, Ästhetik',
    target: 'ux.html',
    isPromotopic: false,
  },
  {
    shortTitle: 'Design',
    buzzwords: 'CI/CD, Farben, Typografie, Ikonografie, Bildsprache, Raster, Interaktionselemente, Verhalten',
    target: 'design.html',
    isPromotopic: false,
  },
  {
    shortTitle: 'Living Styleguide',
    buzzwords: '  Vorschau, Atome, Komponenten, Seitentypen, HTML Code',
    target: 'styleguide.html',
    isPromotopic: false,
  },
];

const data = _.merge({}, defaultData, {
  mainMenu,
  wrappingElements: {
    pageHeaderData: {
      pageTitle: 'Richtlinien für Online-Anwendungen',
      leadText: 'Folgende Richtlinien sind die Basis für alle Arbeiten an unseren Online-Anwendungen und orientieren sich am neuen Webauftritt des Kantons Zürich. Die exemplarischen Inhalte dienen als Orientierungshilfe für die (Weiter-)Entwicklung von anderen Online-Anwendungen.',
      breadcrumb: {
        path: [
          {
            title: 'Kanton Zürich',
            href: '/',
          },
        ],
      },
    },
  },
});

module.exports = data;

const vfs = require('vinyl-fs');
const fs = require('fs');
const through = require('through2').obj;
const path = require('path');
const { handlebars } = require('@unic/estatico-handlebars');

const generateWWW = function(file, enc, cb) {
  const data = require(file.path);
  const f = path.parse(file.path);
  let variants = data.variants ? data.variants : { default: data };
  const isPage = !data.variants;
  for (const variant in variants) {
    const variantProps = isPage ? variants[variant] : variants[variant].props;
    const template = fs.readFileSync(file.path.replace('.data.js', '.hbs'), 'utf-8');
    const compiledVariant = () => handlebars.compile(template)(variantProps);
    const newFile = file.clone();
    newFile.contents = new Buffer(compiledVariant());
    newFile.path = path.join(f.dir, `${f.name.replace('.data', '')}.${variant}.html`);
    this.push(newFile);
  }
  cb();
};

vfs.src([
  './src/atoms/**/*.data.js',
  '!./src/atoms/**/{{fileName}}.data.js',
  './src/modules/**/*.data.js',
  '!./src/modules/**/{{fileName}}.data.js',
  './src/pages/**/*.data.js',
  '!./src/pages/**/{{fileName}}.data.js',
], { base: './src' })
  .pipe(through(generateWWW))
  .pipe(vfs.dest('./www'));
