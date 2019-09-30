const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const {handlebars} = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('person_card.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Personen Card',
    className: 'PersonCard',
    jira: 'CZHDEV-178',
    label: 'Teaser',
    documentation: dataHelper.getDocumentation('person_card.md'),
  },
  props: {
    detailPageLink: '#',
    headingLevel: 4,
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
      hasButton: true,
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
      contactInfo: '<a href="mailto:max.mustermann@ajb.zh.ch" class="atm-text_link">max.mustermann@ajb.zh.ch</a><br>043 258 48 92 (Mo–Do)<br>Sekundarschulen: Grafstal in Lindau | 9 Plus in Rüti | Schweissrüti in Wila, Berufswahlschule Uster', // eslint-disable-line
      buttonText: 'Mehr erfahren',
      hasImage: true,
      hasButton: true,
    },
  },
  noImage: {
    meta: {
      title: 'Ohne Bild',
      desc: '',
    },
    props: {
      name: 'Kantonspolizei Zürich',
      role: 'Personalgewinnung',
      contactInfo: 'Postfach, 8021 Zürich<br>Bürozeiten Mo bis Fr: 08.00 bis 11.00 Uhr und 13.30 bis 16.00 Uhr',
      buttonText: 'Mehr erfahren',
      hasButton: true,
    },
  },
  noImageAlt: {
    meta: {
      title: 'Ohne Bild (Ohne Button)',
      desc: '',
    },
    props: {
      name: 'Yvonne Leibundgut',
      role: 'Leiterin Kommunikation',
      contactInfo: 'yvonne.leibundgut@bi.zh.ch<br>+41 (0) 43 259 23 12<br>Walcheplatz 2, 8090 Zürich<br>Bürozeiten Montag bis Freitag: 08.00 bis 11.00 Uhr und 13.30 bis 16.00 Uhr',
      buttonText: 'Mehr erfahren',
    },
  },
  promo: {
    meta: {
      title: 'Promo Variante',
      desc: '',
    },
    props: {
      name: 'Dr. iur. Kathrin Arioli',
      role: 'Staatsschreiberin Kanton Zürich',
      buttonText: 'Mehr erfahren',
      isPromo: true,
      hasImage: true,
      hasButton: true,
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
