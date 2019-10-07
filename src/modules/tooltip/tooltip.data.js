const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const demoImageFigureData = {
  srcsets: [{
    image: '/assets/media/image/tooltip_211x139_x15.jpeg',
    imageWidth: 558,
  }],
  alt: 'Das ist ein Beispielbild',
  isSmall: false,
  isWide: false,
  hasDownload: false,
  useInCarousel: false,
  noTitle: true,
};

const template = dataHelper.getFileContent('tooltip.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Tooltip',
    className: 'FormInfo',
    jira: 'CZHDEV-1203',
    documentation: dataHelper.getDocumentation('tooltip.md'),
  },
  props: {

  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation, mit Überschrift und einem Text',
    },
    props: {
      helptext: 'Lorem Ipsum',
      bubble: {
        heading: 'Tooltip Ipsum',
        text: 'Ländernamen auf deutsch eingeben',
      },
    },
  },
  noHelpText: {
    meta: {
      title: 'Kein Hilfetext und sehr langer Tooltiptext',
      desc: 'Default implementation, mit Überschrift und einem Text',
    },
    props: {
      bubble: {
        heading: 'Tooltip Ipsum',
        text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      },
    },
  },
  withLinks: {
    meta: {
      title: 'Tooltip mit Links',
      desc: 'Default implementation, mit Überschrift und einem Text',
    },
    props: {
      helptext: 'Datenschutz Richtlinien',
      bubble: {
        text: 'Ihre Daten werden ausschliesslich für den hier ersichtlichen Zweck verwendet. Siehe <a href="#" class="atm-text_link">Datenschutzerklärung</a> und <a href="#" class="atm-text_link">Nutzungsregelung</a>',
      },
    },
  },
  withImage: {
    meta: {
      title: 'Tooltip mit Bild',
      desc: 'Default implementation, mit Überschrift und einem Text',
    },
    props: {
      helptext: 'Datenschutz Richtlinien',
      bubble: {
        text: 'Ihre AHV-Nr. finden Sie unter anderem auf Ihrer Krankenversicherungskarte:',
        image: demoImageFigureData,
      },
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
