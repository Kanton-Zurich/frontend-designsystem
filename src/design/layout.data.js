const _ = require('lodash');
const defaultData = require('../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const markdownHbs = dataHelper.getDocumentation('layout.md').replace(/\{\{(.*?)\}\}/g, (m) => {
  return m.replace(/&gt;/g, '>').replace(/&quot;/g, '"');
});
const markdownData = {
  rasterLargeImage: {
    srcsets: [{
      image: '/preview/assets/media/image/raster_large.jpg',
      imageWidth: 320,
    }],
    alt: 'Raster Gross',
  },
  rasterMediumImage: {
    srcsets: [{
      image: '/preview/assets/media/image/raster_medium.jpg',
      imageWidth: 320,
    }],
    alt: 'Raster Mittel',
  },
  rasterSmallImage: {
    srcsets: [{
      image: '/preview/assets/media/image/raster_small.jpg',
      imageWidth: 320,
    }],
    alt: 'Raster Klein',
  },
  spacingsImage: {
    srcsets: [{
      image: '/preview/assets/media/image/spacings.jpg',
      imageWidth: 320,
    }],
    alt: 'Abstandseinheiten',
  },
  curvesImage: {
    srcsets: [{
      image: '/preview/assets/media/image/size_curves.jpg',
      imageWidth: 320,
    }],
    alt: 'Grössenkurven',
    isWide: true,
  },
  tableData: {
    headers: [
      {
        title: 'Name',
      }, {
        title: 'Von (Breite)',
      }, {
        title: 'Bis (Breite)',
      },
    ],
    bodyrows: [
      {
        data: ['tiny', '320px', '399px'],
      }, {
        data: ['xsmall', '400px', '59px'],
      }, {
        data: ['small', '600px', '839px'],
      }, {
        data: ['medium', '840px', '1023px'],
      }, {
        data: ['large', '1024px', '1279px'],
      }, {
        data: ['xlarge', '1280px', '&infin;'],
      },
    ],
    hasColumnHeader: true,
  },
};

const data = _.merge({}, defaultData, {
  documentation: handlebars.compile(markdownHbs)(markdownData),
  wrappingElements: {
    pageHeaderData: {
      pageTitle: 'Raster & Abstände',
      leadText: 'Ein flexibles Gestaltungsraster ermöglicht es je nach Bedürfniss ein Layout aufzubauen. Der Raster stellt sicher, dass Spalten sauber aufeinander abgestimmt sind. Variationen im Spaltenraster verdeutlichen Hierarchien und helfen dem Nutzer sich zurecht zu finden.',
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
            title: 'Layout',
          },
        ],
      },
    },
  },
});

module.exports = data;
