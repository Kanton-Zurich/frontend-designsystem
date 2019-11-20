const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('checkbox.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Checkbox',
    className: 'Checkbox',
    jira: 'CZHDEV-*',
    documentation: dataHelper.getDocumentation('checkbox.md'),
  },
  props: {
    label: 'Checkbox label',
    id: 1,
    groupName: 'checkbox',
    value: 'value',
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
  },
  withHint: {
    meta: {
      title: 'Mit Hinweis (CZHDEV-1238)',
      desc: 'Checkbox mit Hinweis Feld.',
    },
    props: {
      label: 'Qualifizierte Beteiligungen',
      hint: 'von wenigstens 10% an Aktien-, Grund- oder Stammkapital',
      id: 'wihthint',
    },
  },
  checked: {
    meta: {
      title: 'Vorausgewählt',
      desc: 'Initial Ausgewählt/aktiv.',
    },
    props: {
      isChecked: true,
    },
  },
  disabled: {
    meta: {
      title: 'Deaktiviert',
      desc: 'Initial deaktiviert, nicht click- bzw auswählbar.',
    },
    props: {
      isDisabled: true,
    },
  },
  required: {
    meta: {
      title: 'Erforderlich',
      desc: 'Die Checkbox ist erforderlich',
    },
    props: {
      validation: {
        isRequired: true,
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
        data: dataHelper.getFormattedJson(variantProps),
        html: dataHelper.getFormattedHtml(compiledVariant()),
      },
    },
  });

  return variantData;
});

data.variants = variants;

module.exports = data;
