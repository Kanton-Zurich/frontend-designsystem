const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const downloadLinkItem = {
  linkListItemIsDownload: true,
  isButton: true,
  linkListItemHref: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  linkListItemTitle: 'Download',
};

const documentCardProps = {
  title: 'Preisliste Fischerpatente',
  teaserText: [
    {
      term: 'Grösse',
      description: '12kB',
    },
    {
      term: 'Datum',
      description: '21.12.21',
    },
    {
      term: 'Format',
      description: 'CSV',
    },
    {
      term: 'Sprache',
      description: 'Deutsch',
    },
  ],
  downloadLink: downloadLinkItem,
  link: 'http://search.zh.ch/xyz',
  typeLabel: 'Dokument',
  icon: 'document-csv',
};

const template = dataHelper.getFileContent('top_result.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Top Treffer',
    className: 'TopResult',
    jira: 'CZHDEV-4740',
    label: 'Container',
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
        resultType: 'Dokumente',
        label: 'Top Treffer',
        results: [documentCardProps],
        numberOfAdditionalResults: 4,
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
