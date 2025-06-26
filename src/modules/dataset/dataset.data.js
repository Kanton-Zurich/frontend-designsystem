const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('dataset.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Datenset',
    className: 'Dataset',
    jira: 'CZHDEV-*',
    label: 'UI Element',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {},
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Standard',
        desc: 'Ohne Icon und Status',
      },
      props: {
        heading: 'Statistisches Jahrbuch 2021/4',
        headingLevel: 3,
        meta: [
          {
            term: 'Grösse',
            data: '1.2 MB',
          },
          {
            term: 'Format',
            data: 'CSV',
          },
          {
            term: 'Datum',
            data: '21.12.21',
          },
        ],
      },
    },
    withStatus: {
      meta: {
        title: 'Mit Status',
        desc: 'Mit Status',
      },
      props: {
        withStatus: true,
        status: {
          text: 'Offen',
          modifier: 'notification',
        },
        heading: 'Statistisches Jahrbuch 2021/4',
        headingLevel: 3,
        meta: [
          {
            term: 'Grösse',
            data: '1.2 MB',
          },
          {
            term: 'Format',
            data: 'CSV',
          },
          {
            term: 'Datum',
            data: '21.12.21',
          },
        ],
      },
    },
    withIcon: {
      meta: {
        title: 'Mit Icon',
        desc: 'Mit Icon',
      },
      props: {
        icon: 'documents',
        heading: 'Statistisches Jahrbuch 2021/4',
        headingLevel: 3,
        meta: [
          {
            term: 'Grösse',
            data: '1.2 MB',
          },
          {
            term: 'Format',
            data: 'CSV',
          },
          {
            term: 'Datum',
            data: '21.12.21',
          },
        ],
      },
    },
    withIconAndStatus: {
      meta: {
        title: 'Mit Icon und Status',
        desc: 'Mit Icon und Status',
      },
      props: {
        icon: 'documents',
        withStatus: true,
        status: {
          text: 'Offen',
          modifier: 'notification',
        },
        heading: 'Statistisches Jahrbuch 2021/4',
        headingLevel: 3,
        meta: [
          {
            term: 'Grösse',
            data: '1.2 MB',
          },
          {
            term: 'Format',
            data: 'CSV',
          },
          {
            term: 'Datum',
            data: '21.12.21',
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
