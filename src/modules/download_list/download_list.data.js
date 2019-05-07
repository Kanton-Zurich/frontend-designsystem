const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const downloadLinkItem = require('../../atoms/linklist_item/linklist_item.data').variants.download.props;
const downloadButtonItem = require('../../atoms/linklist_item/linklist_item.data').variants.downloadAsButton.props;

const template = dataHelper.getFileContent('download_list.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'DownloadList',
    className: 'DownloadList',
    jira: 'CZHDEV-172',
    documentation: dataHelper.getDocumentation('download_list.md'),
  },
  props: {
    title: {
      level: 2,
      text: 'H2: Titel',
    },
    links: [
      downloadLinkItem,
      downloadLinkItem,
      downloadButtonItem,
    ],
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Standard mit h2',
      desc: 'Eine Downloadliste mit h2-Titel',
    },
  },
  h3: {
    meta: {
      title: 'Standard mit h3',
      desc: 'Eine Downloadliste mit h3-Titel',
    },
    props: {
      title: {
        level: 3,
        text: 'H3: Titel',
      },
    },
  },
  h4: {
    meta: {
      title: 'Standard mit h4',
      desc: 'Eine Downloadliste mit h3-Titel',
    },
    props: {
      title: {
        level: 4,
        text: 'H4: Titel',
      },
    },
  },
  defaultWithoutTitle: {
    meta: {
      title: 'Standard ohne Titel',
      desc: 'Eine Downloadliste ohne Titel',
    },
    props: {
      title: false,
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
