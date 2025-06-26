const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.noToc.props;
const headerData = require('../../modules/header/header.data');

const defPageHeaderData = require('../../modules/page_header/page_header.data.js');
// const defLeadSectionData = require('../../modules/lead_section/lead_section.data');
const defContactData = require('../../modules/contact/contact.data.js');
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Generische Fehlerseite',
    jira: 'CZHDEV-528',
    content: dataHelper.getFileContent('genericerror.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    title: 'Generische Fehlerseite',
    skiplinks: skiplinksData,
    header: headerData.variants.defaultWithUserLoggedOut.props,
    modules: {
      pageHeader: defPageHeaderData.variants.unavailable.props,
      leadSection: {
        leadText:
          'Die Datenbank enthält wegleitende Entscheide des Regierungsrates, der Direktionen sowie der direktionsabhängigen und -zugeordneten Gremien ab dem 1. Juli 2001. Es handelt sich dabei um Rechtsmittelentscheide, vereinzelt um erstinstanzliche Anordnungen. Die veröffentlichten Entscheide sind in der Regel rechtskräftig.',
      },
      contact: defContactData.variants.fullWidthLessData.props,
      footerData: defFooterData,
    },
  },
});

module.exports = data;
