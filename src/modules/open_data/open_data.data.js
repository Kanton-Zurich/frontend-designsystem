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
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Single',
        desc: 'Eine Liste mit nur einer URL',
      },
      props: {
        heading: {
          level: 2,
          visualLevel: 2,
          title: 'Datenkomponente',
        },
        api_calls: [
          'https://ckan.opendata.swiss/api/3/action/package_show?id=eintragungen-im-handelsregister-des-kantons-zurich',
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
          'https://ckan.opendata.swiss/api/3/action/package_show?id=eintragungen-im-handelsregister-des-kantons-zurich',
          'https://ckan.opendata.swiss/api/3/action/package_show?id=bauzonen-im-kanton-zurich',
          'https://ckan.opendata.swiss/api/3/action/package_show?id=verkehrszahldaten-motorisierter-individualverkehr-miv-im-kanton-zurich',
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
