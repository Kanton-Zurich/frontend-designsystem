const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('radiobutton.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Radiobutton',
    className: 'Radiobutton',
    jira: 'CZHDEV-847',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    label: 'Radio button label',
    groupName: 'Radiogroup',
    id: 1,
    value: 'value',
  },
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Standard',
        desc: '',
      },
    },
    checked: {
      meta: {
        title: 'Ausgewählt',
        desc: '',
      },
      props: {
        isChecked: true,
      },
    },
    disabled: {
      meta: {
        title: 'Deaktiviert',
        desc: 'nicht klick- bzw. auswählbar',
      },
      props: {
        isDisabled: true,
      },
    },
    tag: {
      meta: {
        title: 'Chip als Radiobutton',
        desc: 'Verwendung in der Suche',
      },
      props: {
        id: 'astag',
        asTag: true,
      },
    },
    withDescription: {
      meta: {
        title: 'Mit Hinweis',
        desc: 'zusätzlicher Erklärungstext',
      },
      props: {
        id: 'privatperson',
        groupName: 'taxEntity',
        label: 'Privatperson',
        descr:
          'Berechnen von Bundes-, Staats- und Gemeindesteuerbetrag, Steuerbetrag auf Kapitalleistungen aus Vorsorge sowie Erbschafts- und Schenkungssteuer (Natürliche Personen)',
        isChecked: false,
      },
    },
  },
  (variant) => {
    const variantProps = _.merge({}, data, variant).props;
    const compiledVariant = () => handlebars.compile(template)(variantProps);
    const variantData = _.merge({}, data, variant, {
      meta: {
        demo: compiledVariant,

        code: {
          handlebars: dataHelper.getFormattedHandlebars(template),
          data: dataHelper.getFormattedJson(variantProps),
          html: dataHelper.getFormattedHtml(compiledVariant()),
        },
      },
    });

    return variantData;
  }
);

data.variants = variants;

module.exports = data;
