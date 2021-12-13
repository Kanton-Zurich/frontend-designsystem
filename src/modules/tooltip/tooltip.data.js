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
    className: 'Tooltip',
    jira: 'CZHDEV-1203',
    documentation: dataHelper.getDocumentation('README.md'),
    label: 'Formular',
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
      helptext: 'Lorem Ipsum Lorem Ipsum',
      buttonLeft: true,
      bubble: {
        heading: 'Tooltip Ipsum',
        text: '<p>Ländernamen auf deutsch eingeben</p><ul><li>Part 1</li><li>Part 2<ul><li>AA</li><li>BB</li></ul></li><li>Part 3</li></ul><h4>Subtitle</h4><ol><li>A 1</li><li>A 2</li><li>A 3</li></ol><p>Weiterer Absatztext</p>',
        id: _.uniqueId('aria-default'),
      },
    },
  },
  noLongText: {
    meta: {
      title: 'Langer Tooltiptext',
      desc: 'Tooltip mit Überschrift und einem sehr langen Text<',
    },
    props: {
      buttonRight: true,
      bubble: {
        heading: 'Tooltip Ipsum',
        text: '<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>',
        id: _.uniqueId('aria-longtxt'),
      },
    },
  },
  withLinks: {
    meta: {
      title: 'Tooltip mit Links',
      desc: 'Tooltip mit einem Text der Links enthält',
    },
    props: {
      helptext: 'Datenschutz Richtlinien',
      buttonRight: true,
      bubble: {
        text: '<p>Ihre Daten werden ausschliesslich für den hier ersichtlichen Zweck verwendet. Siehe <a href="#" class="atm-text_link">Datenschutzerklärung</a> und <a href="#" class="atm-text_link">Nutzungsregelung</a></p>',
        id: _.uniqueId('aria-anchors'),
      },
    },
  },
  withImage: {
    meta: {
      title: 'Tooltip mit Bild',
      desc: 'Tooltip mit einem Text und Bild',
    },
    props: {
      helptext: 'Datenschutz Richtlinien',
      buttonRight: true,
      bubble: {
        text: '<p>Ihre AHV-Nr. finden Sie unter anderem auf Ihrer Krankenversicherungskarte:</p>',
        image: demoImageFigureData,
        id: _.uniqueId('aria-image'),
      },
    },
  },
  asTextLink: {
    meta: {
      title: 'Style Textlink',
      desc: 'Kein Icon, text underlined',
    },
    props: {
      helptext: 'Passwort vergessen?',
      asTextLink: true,
      bubble: {
        text: '<p>Bitte kontaktieren Sie diese <a href="mailto:info@sk.zh.ch" target="_blank">Emailadresse</a> wenn Sie ein neues Passwort benötigen.</p>',
        id: _.uniqueId('aria-default'),
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
