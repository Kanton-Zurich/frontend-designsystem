const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const {handlebars} = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defCarouselData = require('../carousel/carousel.data.js');

const template = dataHelper.getFileContent('about.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Über uns',
    className: 'MdlAbout',
    jira: 'CZHDEV-*',
    documentation: dataHelper.getDocumentation('about.md'),
  },
  props: {
    title: 'Über uns',
    pText1: 'Sie Sicherheitsdirektion und die darunter liegenden Ämter und Bereiche kümmern sich um ein grosens Leistungsspektrum des Kantons. Die folgenden Schwerpunkte liegen uns besonders am Herzen.',
    pText2: 'Sie Sicherheitsdirektion und die darunter liegenden Ämter und Bereiche kümmern sich um ein grosens Leistungsspektrum des Kantons. Die folgenden Schwerpunkte liegen uns besonders am Herzen.',
    infoTitle: 'H4: 20px Black title',
    infoText: 'Die Baudirektion hat beim Landesmuseum in Zürich einen Kontrollpunkt beim Landesmuseum in Zürich einen Kontrollpunktfür mobile Geräte eingerichtet – den ersten in der Schweiz.',
    sTitle1: 'Wer wir sind',
    sTitle2: 'Unsere Aufgabe',
    sTitle3: 'Was wir tun',
    smallTitle1: 'Mehr zu diesem Amt',
    smallTitle2: 'Dokumente',
    downloadListData: {
      links: [
        {
          link: {
            linkListItemTitle: 'Verkehrspolizei',
            linkListItemIsDownload: true,
            linkListItemLabel: 'PDF | 1 Seite | DE | 2MB',
            linkListItemHref: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          },
        },
      ],
    },
    topicsData: {
      items: [
        {
          shortTitle: 'Abteilungen',
          buzzwords: null,
        },
        {
          shortTitle: 'Zahlen & Fakten',
          buzzwords: null,
        },
        {
          shortTitle: 'Fachstellen und -bereiche',
          buzzwords: null,
        },
        {
          shortTitle: 'Standorte',
          buzzwords: null,
        },
        {
          shortTitle: 'Die KAPO besichtigen',
          buzzwords: null,
        },
      ],
    },
    carouselData: _.merge({}, defCarouselData.props, { title: false }),
    linklist: {
      list1: {
        links: [
          {
            linkListItemTitle: 'Stellungsnahme des Direktors',
            linkListItemHref: '/',
          },
        ],
      },
    },
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
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
