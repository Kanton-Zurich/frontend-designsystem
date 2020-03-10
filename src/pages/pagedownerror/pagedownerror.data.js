const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.noToc.props;
const headerData = require('../../modules/header/header.data');

const defPageHeaderData = require('../../modules/page_header/page_header.data.js');
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;

const data = _.merge({}, defaultData, {
  title: 'Kanton Zürich - Seite nicht verfügbar',
  description: 'Staatskanzlei Kanton Zürich',
  meta: {
    title: 'Pagedown Fehlerseite',
    jira: 'CZHDEV-529',
    content: dataHelper.getFileContent('pagedownerror.hbs'),
    documentation: dataHelper.getDocumentation('pagedownerror.md'),
  },
  props: {
    skiplinks: skiplinksData,
    header: headerData,
    modules: {
      pageHeader: defPageHeaderData.variants.unavailable.props,
      contact: {
        fullWidth: true,
        contactTitle: 'Kontakt',
        contactSubtitle: 'Kantons Zürich',
        contactAddress: {
          name: 'Staatskanzlei',
          street: 'Neumühlequai 10',
          zip: '8090',
          city: 'Zürich',
          routeLinkHref: '#',
          routeLinkLabel: 'Route anzeigen',
        },
        contactPhone: [
        ],
        contactMail: {
          address: 'info@sk.zh.ch',
        },
      },
      footerData: _.merge({}, defFooterData, {
        maintenance: true,
      }),
    },
  },
});

module.exports = data;
