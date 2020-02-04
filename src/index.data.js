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
