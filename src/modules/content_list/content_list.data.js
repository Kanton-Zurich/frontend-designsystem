const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const contentNavDataDef = require('../content_nav/content_nav.data').variants.default.props;
const contentTeaserDataWithoutBuzzwords = require('../../atoms/content_teaser/content_teaser.data')
  .variants.withoutBuzzwords.props;

const template = dataHelper.getFileContent('content_list.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Inhaltsliste',
    className: 'ContentList',
    jira: 'CZHDEV-4328',
    label: 'Navigation',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    anchorNavReference: 'content_list',
    heading: {
      level: 2,
      visualLevel: 2,
      title: 'Kapitelübersicht',
    },
    contentListNavData: _.merge({}, contentNavDataDef, {
      selector: 'data-topiclist="contentNav"',
      additionalClasses: 'mdl-content_nav--single-column',
      items: [
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: '1   Ausgangslage',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: '2   Entwicklung der Gemeindelandschaft',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: '3   Aufgabenteilung aus Sicht des Kantons',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: '4   Wirksamkeit des Finanzausgleichs',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: '5   Gemeinden 2030',
        }),
        _.merge({}, contentTeaserDataWithoutBuzzwords, {
          shortTitle: '6   Anhänge',
        }),
      ],
    }),
  },
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Standard',
      },
    },
  },
  (variant) => {
    // eslint-disable-next-line consistent-return
    const variantProps = _.mergeWith({}, data, variant, (dataValue, variantValue, key) => {
      if (key === 'items') {
        return variantValue;
      }
    }).props;

    const compiledVariant = () => handlebars.compile(template)(variantProps);
    const variantData = _.mergeWith(
      {},
      data,
      variant,
      {
        meta: {
          demo: compiledVariant,

          code: {
            handlebars: dataHelper.getFormattedHandlebars(template),
            html: dataHelper.getFormattedHtml(compiledVariant()),
            data: dataHelper.getFormattedJson(variantProps),
          },
        },
        // eslint-disable-next-line consistent-return
      },
      (dataValue, variantValue, key) => {
        if (key === 'items') {
          return variantValue;
        }
      }
    );

    return variantData;
  }
);

data.variants = variants;

module.exports = data;
