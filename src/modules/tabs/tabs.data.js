const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('tabs.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Tabs',
    className: 'Tabs',
    jira: 'CZHDEV-473',
    documentation: dataHelper.getDocumentation('tabs.md'),
  },
  props: {
    tabs: [
      {
        title: 'Vor Ort',
        data: '<p class="atm-paragraph">Wenn Ihr Ausweis vor dem 01.01.2013 ausgestellt wurde, müssen Sie ein neues Passfoto machen.  Ihr Reisebüro oder das Konsulat Ihres Reiseziels können Ihnen dabei helfen. </p>',
      },
      {
        title: 'Online',
        data: '<p class="atm-paragraph">Klären Sie ab, ob Sie für Ihr Reiseziel einen internationalen Führerschein benötigen. Ihr Reisebüro oder das Konsulat Ihres Reiseziels können Ihnen dabei helfen. </p>',
      },
      {
        title: 'Per Post',
        data: '<p class="atm-paragraph">Holen Sie den internationalen Führerschein direkt am Schalter einer unserer Strassenverkehrsämter ab.</p>',
      },
    ],
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
