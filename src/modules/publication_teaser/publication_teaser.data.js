const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const defFigcaptionData = require('../../atoms/figcaption/figcaption.data').props;

const template = dataHelper.getFileContent('publication_teaser.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Publikationsteaser',
    className: 'PublicationTeaser',
    jira: 'CZHDEV-180',
    documentation: dataHelper.getDocumentation('publication_teaser.md'),
  },
  props: {
    publicationTitle: 'H3: Kontrollpunkt für mobile Gerate einrichten - den ersten in der Schweiz',
    srcsets: [ {
      image: '/assets/media/image/publication-teaser_5_7_372x526_x15.jpeg',
      imageWidth: 666,
    }],
    alt: 'Das ist ein Beispielbild',
    caption: _.merge({}, defFigcaptionData, {
      caption: 'Das ist ein Bild, Quelle: Fotograf Andreas Andreasen',
    }),
    isSmall: false,
    isWide: false,
    hasDownload: false,
    useInCarousel: false,
    descriptionListItems: [
      {
        item: {
          term: 'Herausgeberin und Bezug',
          description: 'Amt für Verkehr, Empa, Bundesamt für Verkehr, Bundestam für Landwirtschaft, Statistisches Amt',
        },
      },
      {
        item: {
          term: 'Publicationsdatum',
          description: 'Februar 2019',
        },
      },
      {
        item: {
          term: 'Autor',
          description: 'Hans Mustermann',
        },
      },
    ],
    linkListItemTitle: 'Download Publikumsfassung',
    linkListItemIsDownload: true,
    linkListItemLabel: 'PDF | 2 Seiten | Sprache | 117kB',
    linkListItemHref: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
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
