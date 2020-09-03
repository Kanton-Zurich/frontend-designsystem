const _ = require('lodash');
const defaultData = require('../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const markdownHbs = dataHelper.getDocumentation('design_patterns.md').replace(/\{\{(.*?)\}\}/g, (m) => {
  return m.replace(/&gt;/g, '>').replace(/&quot;/g, '"');
});
const markdownData = {
  footer_max: {
    srcsets: [{
      image: '/preview/assets/media/image/footer_max.png',
      imageWidth: 320,
    }],
    alt: 'Footer Web',
  },
  footer_min: {
    srcsets: [{
      image: '/preview/assets/media/image/footer_min.png',
      imageWidth: 320,
    }],
    alt: 'Footer Minimal',
  },
  header_applications: {
    srcsets: [{
      image: '/preview/assets/media/image/header_applications.png',
      imageWidth: 320,
    }],
    alt: 'Header Applikationen',
  },
  header_logo_variants: {
    srcsets: [{
      image: '/preview/assets/media/image/header_logo_variants.png',
      imageWidth: 320,
    }],
    alt: 'Headers in Drittaplikationen',
  },
  header_web_magenta: {
    srcsets: [{
      image: '/preview/assets/media/image/header_magenta.png',
      imageWidth: 320,
    }],
    alt: 'Header Web in Magenta',
  },
  header_web_white: {
    srcsets: [{
      image: '/preview/assets/media/image/header_white.png',
      imageWidth: 320,
    }],
    alt: 'Header Web in Weiss',
  },
  header_reduced_purple: {
    srcsets: [{
      image: '/preview/assets/media/image/header_reduced_purple.png',
      imageWidth: 320,
    }],
    alt: 'Header Services in Violett',
  },
  header_reduced_white: {
    srcsets: [{
      image: '/preview/assets/media/image/header_reduced_white.png',
      imageWidth: 320,
    }],
    alt: 'Header Services in Violett',
  },
  layout_a: {
    srcsets: [{
      image: '/preview/assets/media/image/layout_a.png',
      imageWidth: 320,
    }],
    alt: 'Layout für kommunikative Websites',
  },
  layout_services: {
    srcsets: [{
      image: '/preview/assets/media/image/layout_services.png',
      imageWidth: 320,
    }],
    alt: 'Layout für Services',
  },
  layout_applications: {
    srcsets: [{
      image: '/preview/assets/media/image/layout_applications.png',
      imageWidth: 320,
    }],
    alt: 'Layout für Webapplikationen',
  },
  layout_multicolumn: {
    srcsets: [{
      image: '/preview/assets/media/image/layout_multicolumn.png',
      imageWidth: 320,
    }],
    alt: 'Mehrspaltiges Layout',
  },
};

const data = _.merge({}, defaultData, {
  documentation: handlebars.compile(markdownHbs)(markdownData),
  wrappingElements: {
    pageHeaderData: {
      pageTitle: 'Grundlayout',
      leadText: 'Der Nutzer ist auf einen konsistenten und wiedererkennbaren Aufbau der Website angewiesen. Das Grundlayout soll dem Nutzer bei der Navigation und der Orientierung auf der Website helfen. Beim Kanton Zürich stehen verschiedene UI Patterns für das Grundlayout zur Verfügung, die je nach Anwendungsbereich in unterschiedlichen Kombinationen eingesetzt werden können.',
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
            title: 'Design Patterns',
          },
        ],
      },
    },
  },
  anchornav: {
    anchornavTitle: {
      level: 2,
      title: 'Inhaltsverzeichnis',
    },
    anchornavItems: [
      {
        anchorlink: {
          anchorlinkText: 'Header',
          anchorlinkAdress: 'header',
          anchorlinkIsActive: true,
          anchorlinkAsButton: true,
        },
      },
      {
        anchorlink: {
          anchorlinkText: 'Footer',
          anchorlinkAdress: 'footer',
          anchorlinkIsActive: false,
          anchorlinkAsButton: true,
        },
      },
      {
        anchorlink: {
          anchorlinkText: 'Layouttypen',
          anchorlinkAdress: 'layouttypen',
          anchorlinkIsActive: false,
          anchorlinkAsButton: true,
        },
      },
      {
        anchorlink: {
          anchorlinkText: 'Drittapplikationen',
          anchorlinkAdress: 'drittapplikationen',
          anchorlinkIsActive: false,
          anchorlinkAsButton: true,
        },
      },
    ],
  },
});

module.exports = data;
