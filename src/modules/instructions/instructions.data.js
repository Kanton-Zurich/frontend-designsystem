const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const richtextDemoData = require('../richtext/richtext.data');
const linklistDemoData = require('../linklist/linklist.data');
const videoDemoData = require('../video/video.data');
const imageFigureDemoData = require('../image_figure/image_figure.data');
const carouselDemoData = require('../carousel/carousel.data');
const texthighlightDemoData = require('../texthighlight/texthighlight.data');
const defTabsData = require('../tabs/tabs.data').variants.default.props;

const carouselHBS = dataHelper.getFileContent('../carousel/carousel.hbs');
const imageFigureHBS = dataHelper.getFileContent('../image_figure/image_figure.hbs');
const videoHBS = dataHelper.getFileContent('../video/video.hbs');
const linklistHBS = dataHelper.getFileContent('../linklist/linklist.hbs');
const richtextHBS = dataHelper.getFileContent('../richtext/richtext.hbs');
const tabsHBS = dataHelper.getFileContent('../tabs/tabs.hbs');
const texthighlightHBS = dataHelper.getFileContent('../texthighlight/texthighlight.hbs');

const template = dataHelper.getFileContent('instructions.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Anleitung',
    className: 'Instructions',
    jira: 'CZHDEV-223',
    label: 'Container',
    documentation: dataHelper.getDocumentation('instructions.md'),
  },
  props: _.merge({ instructions_title: 'Anleitung (H2)' },
    richtextDemoData.props, linklistDemoData.props, videoDemoData.props, { headingLevel: 4 },
    imageFigureDemoData.props, carouselDemoData.props, { title: { level: 4 } },
    texthighlightDemoData.props),
});

function getItems(ordered) {
  const headingsPre = ordered ? 'Anleitungsschritt-Titel' : 'Checklistenpunkt-Titel';
  return [{
    heading: `${headingsPre} (mit Linklisten Module)`,
    contentModules: [
      () => handlebars.compile(linklistHBS)(_.merge({},
        linklistDemoData.props, { headingLevel: 4 })),
    ],
  }, {
    heading: `${headingsPre} (mit Video Module)`,
    contentModules: [
      () => handlebars.compile(videoHBS)(_.merge({},
        videoDemoData.props, { title: true, headingLevel: 4 })),
    ],
  }, {
    heading: `${headingsPre} (mit Bilder Module)`,
    contentModules: [
      () => handlebars.compile(imageFigureHBS)(imageFigureDemoData.props),
    ],
  }, {
    heading: `${headingsPre} (mit Bildgallerie/Carousel Module)`,
    contentModules: [
      () => handlebars.compile(carouselHBS)(_.merge({},
        carouselDemoData.props, { title: { level: 4 } })),
    ],
  }, {
    heading: `${headingsPre} (mit Infobox Module)`,
    contentModules: [
      () => handlebars.compile(texthighlightHBS)(_.merge({}, texthighlightDemoData.props,
        linklistDemoData.props,
        imageFigureDemoData.props, {
          headingLevel: 4,
          texthighlightId: _.uniqueId('texthighlight'),
        })),
    ],
  },
  ];
}

const variants = _.mapValues({
  default: {
    meta: {
      title: 'Anleitungsliste',
      desc: 'Standard-Implementation mit einer nummerierten Liste',
    },
    props: {
      instructionslistItems: getItems(true),
    },
  },
  unordered: {
    meta: {
      title: 'Checkpunktliste',
      desc: 'Standard-Implementation mit einer unnummerierten Liste',
    },
    props: {
      isUnordered: true,
      instructionslistItems: getItems(),
    },
  },
  serviceDemo: {
    meta: {
      title: 'Service',
      desc: '',
    },
    props: {
      isUnordered: false,
      service: true,
      instructionslistItems: [{
        heading: 'Bevor Sie starten',
        contentModules: [
          () => handlebars.compile(richtextHBS)({
            embedded: true,
            contentItems: [
              { pText: 'Klären Sie ab, ob Sie für Ihr Reiseziel einen internationalen Führerschein benötigen. Ihr Reisebüro oder das Konsulat Ihres Reiseziels können Ihnen dabei helfen.' },
            ],
          }),
          () => handlebars.compile(linklistHBS)({
            links: [
              {
                linkListItemTitle: 'Stellungsnahme des Direktors', linkListItemHref: '/',
              },
            ],
          }),
        ],
      }, {
        heading: 'Dokumente vorbereiten',
        contentModules: [
          () => handlebars.compile(richtextHBS)({
            embedded: true,
            contentItems: [
              { pText: 'Führerausweis Kopie.' },
              { pText: 'Wenn Ihr Ausweis vor dem 01.01.2013 ausgestellt wurde, müssen Sie ein neues Passfoto machen.' },
              { pText: '<a href="#" class="atm-text_link">Diese Anforderungen muss Ihr Passfoto erfüllen</a>' },
            ],
          }),
        ],
      }, {
        heading: 'Schritt 2',
        contentModules: [
          () => handlebars.compile(richtextHBS)({
            embedded: true,
            contentItems: [
              { pText: 'Führerausweis Kopie.' },
              { pText: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.' },
              { pText: '<a href="#" class="atm-text_link">Diese Anforderungen muss Ihr Passfoto erfüllen</a>' },
            ],
          }),
        ],
        }, {
        heading: 'Beantragen',
        contentModules: [
          () => handlebars.compile(richtextHBS)({
            embedded: true,
            contentItems: [
              { pText: 'Wenn Ihr Ausweis vor dem 01.01.2013 ausgestellt wurde, müssen Sie ein neues Passfoto machen.  Ihr Reisebüro oder das Konsulat Ihres Reiseziels können Ihnen dabei helfen.' },
            ],
          }),
          () => handlebars.compile(tabsHBS)(defTabsData),
        ],
      },
      ],
    },
  },
}, (variant) => {
  const variantProps = _.merge({}, data, variant).props;
  const compiledVariant = () => handlebars.compile(template)(variantProps);
  const variantData = _.merge({}, data, variant, {
    meta: {
      demo: compiledVariant,

      code: {
        handlebars: dataHelper.getFormattedHandlebars(template),
        html: dataHelper.getFormattedHtml(compiledVariant()),
        data: dataHelper.getFormattedJson(variantProps),
      },
    },
  });

  return variantData;
});

data.variants = variants;

module.exports = data;
