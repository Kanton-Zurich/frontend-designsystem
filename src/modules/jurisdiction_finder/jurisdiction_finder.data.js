const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defSearchInputData = require('../../atoms/form_input/form_input.data');

const template = dataHelper.getFileContent('jurisdiction_finder.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Zuständigkeits-Finder',
    className: 'JurisdictionFinder',
    jira: 'CZHDEV-1131',
    documentation: dataHelper.getDocumentation('jurisdiction_finder.md'),
  },
  props: {
    text: 'Geben Sie Ihre Postleitzahl ein, um die Beratungsangebote in Ihrer Nähe zu finden.',
    buttonData: {
      text: 'Beratungsangebote anzeigen',
      isTextVisible: true,
      additionalAttribute: 'type="button"',
    },
    searchInputData: _.merge({}, defSearchInputData.props, {
      label: 'PLZ',
      type: 'text',
      isSmall: true,
      autocompleteOff: true,
      iconOnly: {
        icon: 'search',
      },
      additionalFunctionality: {
        icon: 'clear',
        buttontype: 'clear',
        ariaText: 'Lösche Eingabe',
      },
    }),
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
