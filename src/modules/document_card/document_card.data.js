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

const template = dataHelper.getFileContent('document_card.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Dokument Card',
    className: 'DocumentCard',
    jira: 'CZHDEV-4787',
    label: 'Teaser',
    documentation: dataHelper.getDocumentation('README.md'),
  },
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Default',
        desc: 'Default implementation',
      },
      props: {
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
      },
    },
    pdf: {
      meta: {
        title: 'PDF',
        desc: 'PDF implementation',
      },
      props: {
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
        isPdf: true,
        icon: 'document-pdf',
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
