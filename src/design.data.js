const _ = require('lodash');
const defaultData = require('./data/default.data.js');
const defTopiclistData = require('./modules/topiclist/topiclist.data').variants.home.props;
const defFigcaptionData = require('./atoms/figcaption/figcaption.data').props;
const dataHelper = require('@unic/estatico-data');

// Get other pages
const mainMenu = _.merge({}, defTopiclistData, {
  topiclistInput: null,
  additionalClasses: 'sg_topiclist',
});

mainMenu.topiclistcontentNavData.items = [
  {
    shortTitle: 'Grundlagen',
    buzzwords: 'Farben, Interaktionselemente,  Bilder, Bildsprache',
    target: 'design/grundlagen.html',
    isPromotopic: false,
  },
  {
    shortTitle: 'Verhalten & Animation',
    buzzwords: 'Prinzipien, Timing, Bewegen und Skalieren, Easing',
    target: 'design/verhalten.html',
    isPromotopic: false,
  },
  {
    shortTitle: 'Raster & Abstände',
    buzzwords: 'Grid, Raster, Breakpoints, Abstände, Abstandskurven',
    target: 'design/layout.html',
    isPromotopic: false,
  },
  {
    shortTitle: 'Typografie & Ikonografie',
    buzzwords: 'Schrift, Schriftgrössen, Responsive Typografie, Ikonografie',
    target: 'design/typography.html',
    isPromotopic: false,
  },
];

const documentation = dataHelper.getDocumentation('design.md');

const data = _.merge({}, defaultData, {
  mainMenu,
  documentation,
  publicationTeaser: {
    imageFigure: {
      srcsets: [{
        image: '/preview/assets/media/image/manual.png',
        imageWidth: 558,
      }],
      alt: 'CI CD Manual image',
      caption: _.merge({}, defFigcaptionData, {
        caption: 'CI/CD Manual ',
      }),
      isSmall: false,
      isWide: false,
      hasDownload: false,
      useInCarousel: false,
    },
    descriptionList: {
      descriptionListItems: [
        {
          item: {
            term: 'Herausgeberin und Bezug',
            description: 'Direktion der Justiz und des Innern, Gesundheitsdirektion, Volkswirtschaftsdirektion, Baudirektion  Staatskanzlei des Kantons Zürich.',
          },
        },
        {
          item: {
            term: 'Publikationsdatum',
            description: '14. Mai 2014',
          },
        },
        {
          item: {
            term: 'Autor',
            description: 'Kanton Zürich',
          },
        },
      ],
    },
    linkListItem: {
      linkListItemTitle: 'Download',
      linkListItemIsDownload: true,
      linkListItemLabel: 'PDF | 124 Seiten | DE | 22 MB',
      //linkListItemHref: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      //linkListItemHref: '<a href="../assets/media/pdf/corporate_design_manual_kanton_zuerich_2014.pdf></a>',
      linkListItemHref: 'https://www.zh.ch/content/dam/zhweb/bilder-dokumente/themen/politik-staat/kanton/kantonale-verwaltung/corporate_design_manual_kanton_zuerich_2014.pdf',
    },
  


  },
  wrappingElements: {
    pageHeaderData: {
      pageTitle: 'Design',
      leadText: 'Das Design des Webauftritts des Kantons Zürich arbeitet mit klaren und gut lesbaren Schriften und Farben. Es ist bewusst reduziert gehalten um den Bedürfnissen der Benutzer zu entsprechen. Die Seiten haben einen neutralen weissen Hintergrund und jeweils eine Aktzentfarbe, die in bestimmten Elementen genutzt wird, um der Seite eine Struktur zu geben.',
      breadcrumb: {
        path: [
          {
            title: 'Kanton Zürich',
            href: 'index.html',
          },
          {
            title: 'Design',
          },
        ],
      },
    },
  },
});

module.exports = data;
