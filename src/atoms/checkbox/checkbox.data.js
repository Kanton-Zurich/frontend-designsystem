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
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    label: 'Checkbox label',
    id: 1,
    groupName: 'checkbox',
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
    required: {
      meta: {
        title: 'Erforderlich',
        desc: '',
      },
      props: {
        validation: {
          isRequired: true,
        },
      },
    },
    withHint: {
      meta: {
        title: 'Mit Hinweis',
        desc: 'zusätzlicher Erklärungstext',
      },
      props: {
        label: 'Qualifizierte Beteiligungen',
        hint: 'von wenigstens 10% an Aktien-, Grund- oder Stammkapital',
        id: 'wihthint',
      },
    },
    withDataParams: {
      meta: {
        title: 'Mit data-Attributen',
        desc: 'zusätzliche data-Attribute',
      },
      props: {
        data: [
          {
            key: 'testdata',
            value: 'testvalue',
          },
          {
            key: 'testdata2',
            value: 'testvalue2',
          },
        ],
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
