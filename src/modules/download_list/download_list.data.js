const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const downloadLinkItem = {
  linkListItemTitle: 'Dokument',
  linkListItemIsDownload: true,
  linkListItemLabel: 'PDF | 1 Seite | DE | 2MB',
  linkListItemHref: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
};
const downloadButtonItem = {
  linkListItemTitle: 'Documents',
  linkListItemIsDownload: true,
  linkListItemLabel: 'PDF | 1 Seite | DE, FR, IT | 100kB',
  isButton: true,
  linkListItemHref: false,
};
const downloadLegalFoundation = require('../../atoms/linklist_item/linklist_item.data').variants.legalFoundation.props;

const contextMenuDownload = require('../context_menu/context_menu.data').variants.download.props;

const template = dataHelper.getFileContent('download_list.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Download-Liste',
    className: 'DownloadList',
    jira: 'CZHDEV-172',
    label: 'Liste',
    documentation: dataHelper.getDocumentation('download_list.md'),
    disabledColorVariations: ['cv-monochrome', 'cv-turqoise', 'cv-bordeaux', 'cv-magenta', 'cv-violet', 'cv-green', 'cv-darkblue', 'cv-anthracite'],
  },
  props: {
    title: {
      level: 2,
      text: 'H2: Titel',
    },
    links: [
      {
        link: downloadLinkItem,
      },
      {
        link: downloadLinkItem,
      },
      {
        link: _.merge({}, downloadButtonItem, {
          additionalAttributes: 'data-download_list="openContext"',
        }),
        contextMenu: _.merge({}, contextMenuDownload, {
          domSelector: 'data-download_list="contextMenu"',
        }),
      },
      {
        link: _.merge({}, downloadButtonItem, {
          additionalAttributes: 'data-download_list="openContext"',
        }),
        contextMenu: _.merge({}, contextMenuDownload, {
          domSelector: 'data-download_list="contextMenu"',
        }),
      },
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
      desc: 'Eine Downloadliste mit h4-Titel',
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
  defaultWithoutTitleLast: {
    meta: {
      title: 'Standard ohne Titel',
      desc: 'Eine Downloadliste ohne Titel',
    },
    props: {
      title: false,
      isLast: true,
    },
  },
  legalFoundationDownloadList: {
    meta: {
      title: 'Rechtliche Grundlagen',
      desc: 'Eine Downloadliste mit rechtlichen Grundlagen',
    },
    props: {
      title: {
        level: 3,
        text: 'Rechtliche Grundlagen',
      },
      links: [
        {
          link: downloadLegalFoundation,
        },
        {
          link: downloadLegalFoundation,
        },
        {
          link: downloadLegalFoundation,
        },
        {
          link: downloadLegalFoundation,
        },
      ],
    },
  },
  legalFoundationDownloadListNoTitle: {
    meta: {
      title: 'Rechtliche Grundlagen (ohne Titel)',
      desc: 'Eine Downloadliste mit rechtlichen Grundlagen (kein Titel)',
    },
    props: {
      title: false,
      links: [
        {
          link: downloadLegalFoundation,
        },
        {
          link: downloadLegalFoundation,
        },
        {
          link: downloadLegalFoundation,
        },
        {
          link: downloadLegalFoundation,
        },
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
