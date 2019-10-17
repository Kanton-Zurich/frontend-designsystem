const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const defPageHeaderData = require('../../modules/page_header/page_header.data.js');
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Pagedown Fehlerseite',
    jira: 'CZHDEV-529',
    content: dataHelper.getFileContent('pagedownerror.hbs'),
    documentation: dataHelper.getDocumentation('pagedownerror.md'),
  },
  props: {
    modules: {
      pageHeader: defPageHeaderData.variants.unavailable.props,
      contact: {
        fullWidth: true,
        contactTitle: 'Kontakt',
        contactSubtitle: 'Kanton Zürich',
        contactAddress: {
          name: 'Zürich-Albisgütli',
          street: 'Uetlibergstrasse 301',
          zip: '8036',
          city: 'Zürich',
          routeLinkHref: '#',
          routeLinkLabel: 'Route anzeigen',
        },
        contactPhone: [
          {
            anchorLabel: '058 811 30 00',
            phoneNumer: '+41588113000',
            additionalInfo: 'Telefon',
          },
        ],
        contactMail: {
          address: 'info@zh.ch',
        },
      },
      footerData: defFooterData,
    },
  },
});

module.exports = data;
