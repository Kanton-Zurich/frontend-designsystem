const _ = require('lodash');
const defaultData = require('../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const markdownHbs = dataHelper.getDocumentation('grundlagen.md').replace(/\{\{(.*?)\}\}/g, (m) => {
  return m.replace(/&gt;/g, '>').replace(/&quot;/g, '"');
});
const markdownData = {
  colorsImage: {
    srcsets: [{
      image: '/preview/assets/media/image/colors.jpg',
      imageWidth: 320,
    }],
    alt: 'Farben',
    caption: {
      caption: 'Akzentfarben mit AA Accessibility',
    },
  },
  colorsActiveImage: {
    srcsets: [{
      image: '/preview/assets/media/image/colors_active.jpg',
      imageWidth: 320,
    }],
    alt: 'Farben',
    caption: {
      caption: 'Funktionsfarben mit AA Accessibility',
    },
  },
  buttonsImage: {
    srcsets: [{
      image: '/preview/assets/media/image/buttons.jpg',
      imageWidth: 320,
    }],
    alt: 'Buttons',
  },
  linksImage: {
    srcsets: [{
      image: '/preview/assets/media/image/links.jpg',
      imageWidth: 320,
    }],
    alt: 'Links',
  },
  tagsImage: {
    srcsets: [{
      image: '/preview/assets/media/image/tags.jpg',
      imageWidth: 320,
    }],
    alt: 'Tags',
  },
};

const data = _.merge({}, defaultData, {
  documentation: handlebars.compile(markdownHbs)(markdownData),
  wrappingElements: {
    pageHeaderData: {
      pageTitle: 'Grundlagen',
      leadText: 'Der Webauftritt benutzt unterschiedliche Interaktionselemente wie Buttons, Links oder auch Filterlemente. Sie zeigen den Nutzenden Handlungsmöglichkeiten auf. Jedes Interaktionselement gibt auf onHover respektive onTap den Nutzenden ein visuelles Feedback zurück.',
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
            title: 'Grundlagen',
          },
        ],
      },
    },
  },
});

module.exports = data;
