const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const contextMenuItemDownload = require('../../atoms/context_menu_item/context_menu_item.data')
  .variants.download.props;

const template = dataHelper.getFileContent('context_menu.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'ContextMenu',
    className: 'ContextMenu',
    jira: 'CZHDEV-*',
    documentation: dataHelper.getDocumentation('README.md'),
    label: 'Navigation',
  },
});

data.colorVariations = []; // no color variations available

const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Standard',
        desc: 'Standard Kontextmenü',
      },
    },
    download: {
      meta: {
        title: 'Download Kontextmenü',
        desc: 'Kontextmenü welches erscheint bei einem Download mit mehreren Sprachen',
      },
      props: {
        lists: [
          {
            items: [
              _.merge({}, contextMenuItemDownload, { text: 'Deutsch' }),
              _.merge({}, contextMenuItemDownload, { text: 'Français' }),
              _.merge({}, contextMenuItemDownload, { text: 'Italiano' }),
            ],
          },
        ],
      },
    },
    fileTypes: {
      meta: {
        title: 'Dateitypen',
        desc: 'Kontextmenü mit verschiedenen Dateitypen',
      },
      props: {
        lists: [
          {
            items: [
              {
                href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                text: 'Als CSV (14kB)',
                isDownload: true,
              },
              {
                href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                text: 'Als XLS (45kB)',
                isDownload: true,
              },
              {
                href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                text: 'Als PNG (356kB)',
                isDownload: true,
              },
              {
                href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                text: 'Als JPG (231kB)',
                isDownload: true,
              },
              {
                href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                text: 'Als PDF (1.2MB)',
                isDownload: true,
              },
              { isBreak: true },
              {
                href: 'https://ckan.opendata.swiss/dataset/eintragungen-im-handelsregister-des-kantons-zurich',
                text: 'OGD Daten',
                iconAfter: 'arrow-right',
                additionalAttribute: 'target="_blank"',
              },
            ],
          },
        ],
      },
    },
    fileTypes2: {
      meta: {
        title: 'Andere Dateitypen',
        desc: 'Kontextmenü mit anderen Dateitypen',
      },
      props: {
        lists: [
          {
            items: [
              {
                href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                text: 'Als CSV (14kB)',
                isDownload: true,
              },
              {
                href: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                text: 'Als XLS (45kB)',
                isDownload: true,
              },
              { isBreak: true },
              {
                href: 'https://ckan.opendata.swiss/dataset/eintragungen-im-handelsregister-des-kantons-zurich',
                text: 'OGD Daten',
                iconAfter: 'arrow-right',
                additionalAttribute: 'target="_blank"',
              },
            ],
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
