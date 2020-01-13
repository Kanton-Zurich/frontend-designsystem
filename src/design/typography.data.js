const _ = require('lodash');
const defaultData = require('../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');


const markdownHbs = dataHelper.getDocumentation('typography.md').replace(/\{\{(.*?)\}\}/g, (m) => {
  return m.replace(/&gt;/g, '>').replace(/&quot;/g, '"');
});
const markdownData = {
  fontsImage: {
    srcsets: [{
      image: '/preview/assets/media/image/typography_fonts.jpg',
      imageWidth: 320,
    }],
    alt: 'Schriftgrössen',
    caption: {
      caption: 'Schriftgrössen',
    },
  },
  fontCurvesImage: {
    srcsets: [{
      image: '/preview/assets/media/image/typography_curves.jpg',
      imageWidth: 320,
    }],
    alt: 'Responsive Schriftgrössen',
    caption: {
      caption: 'Responsive Schriftgrössen',
    },
    isWide: true,
  },
  iconographyImage: {
    srcsets: [{
      image: '/preview/assets/media/image/iconography.jpg',
      imageWidth: 320,
    }],
    alt: 'Icons',
    caption: {
      caption: 'Icons',
    },
  },
  iconsDownload: {
    linkListItemTitle: 'Download Icon-Set',
    linkListItemIsDownload: true,
    linkListItemLabel: 'ZIP',
    linkListItemHref: '../preview/assets/media/icons.zip',
  },
};

const data = _.merge({}, defaultData, {
  documentation: handlebars.compile(markdownHbs)(markdownData),
  wrappingElements: {
    pageHeaderData: {
      pageTitle: 'Typografie & Ikonografie',
      leadText: 'Die Typografie ist hierarchisch ausgewogen strukturiert. Sie führt Nutzende intuitiv zu den gewünschten Informationen. Zur Gestaltung und Strukturierung von Inhalten dienen die Schriftschnitte Black und Roman. ',
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
            title: 'Typografie',
          },
        ],
      },
    },
  },
});

module.exports = data;
