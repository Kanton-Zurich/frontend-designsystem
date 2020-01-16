const _ = require('lodash');
const defaultData = require('../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const videoData = require('../modules/video/video.data').variants.default.props;

const markdownHbs = dataHelper.getDocumentation('verhalten.md').replace(/\{\{(.*?)\}\}/g, (m) => {
  return m.replace(/&gt;/g, '>').replace(/&quot;/g, '"');
});
const markdownData = {
  /* ---------------------------*/
  /* Markdown handlebar objects */
  /* ---------------------------*/
  buttonData : {
    text: 'Hallo',
    isTextVisible: true,
  },
  videoData,
};

const data = _.merge({}, defaultData, {
  documentation: handlebars.compile(markdownHbs)(markdownData),
  wrappingElements: {
    pageHeaderData: {
      /* Seitenkopf titel */
      pageTitle: 'Verhalten & Animation',
      /* Leadtext unter dem Titel */
      leadText: 'Durch Animationen involvieren wir unsere Nutzer stärker in das Produkterlebnis und bauen Nähe auf. Interaktionen machen unsere Prozesse sichtbar und Funktionen erlebbar, was zu einer besseren Nutzerzufriedenheit führt. Dabei sind Interaktionen und Transitions immer nachvollziehbar und machen die digitale Erfahrung stimmig.',
      /* Breadcrumb items mit links */
      breadcrumb: {
        path: [
          {
            title: 'Kanton Zürich',
            href: '../index.html',
          },
          {
            title: 'Design',
            href: '../design.html',
          },
          {
            title: 'Verhalten & Animation',
          },
        ],
      },
    },
  },
});

module.exports = data;
