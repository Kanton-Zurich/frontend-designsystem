const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const contextMenuDownload = require('../context_menu/context_menu.data').variants.fileTypes.props;
const contextMenuDownload2 = require('../context_menu/context_menu.data').variants.fileTypes2.props;

const template = dataHelper.getFileContent('data_download.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Daten-Download',
    className: 'DataDownload',
    jira: 'CZHDEV-3761',
    label: 'UI Element',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {},
});
const variants = _.mapValues(
  {
    singleFile: {
      meta: {
        title: 'Download einzelne Datei',
      },
      props: {
        text: 'Daten zur Grafik',
        meta: '12kB/CSV',
        href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
    },
    singleLink: {
      meta: {
        title: 'Einzelner Link',
      },
      props: {
        text: 'Daten zur Grafik',
        isLink: true,
        href: 'https://ckan.opendata.swiss/dataset/eintragungen-im-handelsregister-des-kantons-zurich',
      },
    },
    multi: {
      meta: {
        title: 'Download mehrere Dateien',
      },
      props: {
        text: 'Daten zur Grafik (Test extralanger Text)',
        contextMenu: _.merge({}, contextMenuDownload, {
          domSelector: 'data-download_list="contextMenu"',
        }),
      },
    },
    multi2: {
      meta: {
        title: 'Download andere Dateien',
      },
      props: {
        text: 'Daten zur Grafik',
        contextMenu: _.merge({}, contextMenuDownload2, {
          domSelector: 'data-download_list="contextMenu"',
        }),
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
