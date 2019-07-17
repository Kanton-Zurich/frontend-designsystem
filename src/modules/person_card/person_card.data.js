const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('person_card.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Personen Card',
    className: 'PersonCard',
    jira: 'CZHDEV-178',
    documentation: dataHelper.getDocumentation('person_card.md'),
  },
  props: {

  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
    props: {
      name: 'Carla Mom',
      role: 'Leitende Berufs-, Studien- und Laufbahnberaterin',
      contactInfo: '<a href="mailto:carla.mom@ajb.zh.ch" class="atm-text_link">carla.mom@ajb.zh.ch</a>',
      buttonText: 'Mehr erfahren',
      hasImage: true,
    },
  },
  alt: {
    meta: {
      title: 'Alternative Variante',
      desc: '',
    },
    props: {
      name: 'Max Mustermann',
      role: 'Berufs-, Studien- und Laufbahnberater',
      contactInfo: '<a href="mailto:max.mustermann@ajb.zh.ch" class="atm-text_link">max.mustermann@ajb.zh.ch </a><br>043 258 48 92 (Mo–Do)<br> Sekundarschulen: Grafstal in Lindau | 9 Plus in Rüti | Schweissrüti in Wila, Berufswahlschule Uster',
      buttonText: 'Mehr erfahren',
      hasImage: true,
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
