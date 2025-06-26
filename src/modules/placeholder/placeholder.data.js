const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('placeholder.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Platzhalter',
    className: 'Placeholder',
    label: 'UI Element',
    jira: 'CZHDEV-3528',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {},
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Default',
        desc: 'Default implementation',
      },
      props: {
        title: 'Personen erfassen',
        text: 'Hier können Sie beispielsweise noch Kinder, Unterstützungsbedürftige Personen erfassen',
        button: {
          text: 'Erfassen',
          href: '#',
        },
      },
    },
    noButton: {
      meta: {
        title: 'Kein Button',
        desc: 'Kein Button',
      },
      props: {
        title: 'Personen erfassen',
        text: 'Hier können Sie beispielsweise noch Kinder, Unterstützungsbedürftige Personen erfassen',
      },
    },
    noTitle: {
      meta: {
        title: 'Kein Titel',
        desc: 'Kein Titel',
      },
      props: {
        text: 'Hier können Sie beispielsweise noch Kinder, Unterstützungsbedürftige Personen erfassen',
        button: {
          text: 'Erfassen',
          href: '#',
        },
      },
    },
    noTitleNoButton: {
      meta: {
        title: 'Nur Text',
        desc: 'Nur Text',
      },
      props: {
        text: 'Hier können Sie beispielsweise noch Kinder, Unterstützungsbedürftige Personen erfassen',
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
          html: dataHelper.getFormattedHtml(compiledVariant()),
          data: dataHelper.getFormattedJson(variantProps),
        },
      },
    });

    return variantData;
  }
);

data.variants = variants;

module.exports = data;
