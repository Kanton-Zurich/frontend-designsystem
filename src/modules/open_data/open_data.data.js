const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const linklistItem = require('../../atoms/linklist_item/linklist_item.data');

const templateBracketCleaner = require('../../../gulp/helpers/templateBracketCleaner');

const template = dataHelper.getFileContent('open_data.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Datenkomponente',
    className: 'OpenData',
    jira: 'CZHDEV-486',
    documentation: dataHelper.getDocumentation('README.md'),
    label: 'Liste',
  },
  props: {
    template: templateBracketCleaner(linklistItem.variants.openDataDownload.meta.demo()),
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Single',
      desc: 'Eine Liste mit nur einer URL',
    },
    props: {
      title: {
        level: 2,
        text: 'Datenkomponente',
      },
      api_calls: [
        'https://opendata.swiss/api/3/action/resource_show?id=47b71c10-8fe7-4d58-804e-74d2b1e45c82',
      ],
    },
  },
  multiple: {
    meta: {
      title: 'Multiple',
      desc: 'Eine Liste mit mehreren URLS',
    },
    props: {
      api_calls: [
        'https://opendata.swiss/api/3/action/resource_show?id=c6ae3b25-c6a5-4713-82e2-e8207c8fa1d0',
        'https://opendata.swiss/api/3/action/resource_show?id=23d010f4-a5d8-4eaf-beb1-764e2bcb783e',
        'https://opendata.swiss/api/3/action/resource_show?id=c11e04b2-7647-43f9-a7ea-97186ed2d4c9',
      ],
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
