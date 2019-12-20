const _ = require('lodash');
const defaultData = require('./data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const documentation = dataHelper.getDocumentation('ux.md');

const data = _.merge({}, defaultData, {
  documentation,
  wrappingElements: {
    pageHeaderData: {
      pageTitle: 'User Experience',
      leadText: 'Die User Experience beschreibt, was die Nutzenden mit unseren Angeboten erleben und erfahren. Sie umfasst nicht nur das Online-Angebot. Vielmehr das gesamte Erlebnis der Nutzenden bei der Erfüllung eines Bedürfnisses.',
      breadcrumb: {
        path: [
          {
            title: 'Kanton Zürich',
            href: 'index.html',
          },
          {
            title: 'User Experience',
          },
        ],
      },
    },
  },
});

module.exports = data;
