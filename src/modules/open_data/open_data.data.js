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
    documentation: dataHelper.getDocumentation('open_data.md'),
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
      api_calls: [
        'https://opendata.swiss/api/3/action/resource_show?id=5269cdb7-54bf-4737-ac96-fb1cb8d3aab8',
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
        'https://opendata.swiss/api/3/action/resource_show?id=5269cdb7-54bf-4737-ac96-fb1cb8d3aab8',
        'https://opendata.swiss/api/3/action/resource_show?id=d9b73fbd-3a04-435a-a32a-8fd6c853a5d4',
        'https://opendata.swiss/api/3/action/resource_show?id=7572c083-b451-4271-9ab9-ea921853a12a',
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
