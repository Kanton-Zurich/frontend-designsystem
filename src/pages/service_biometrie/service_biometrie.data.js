const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.noToc.props;
const headerData = require('../../modules/header/header.data').props;

const defBreadcrumbData = require('../../modules/breadcrumb/breadcrumb.data.js').variants.default.props;
const defInstructionsData = require('../../modules/instructions/instructions.data.js').variants.biometrie.props;
const contactData = require('../../modules/contact/contact.data').variants.fullWidth.props;
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const defBack2TopData = require('../../modules/back2top/back2top.data').variants.default.props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Serviceseite Biometrie',
    jira: 'CZHDEV-517',
    content: dataHelper.getFileContent('service_biometrie.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    skiplinks: skiplinksData,
    header: headerData,
    title: 'Serviceseite Biometrie',
    text: '',
    defaultColorVariation: 'cv-violet',
    modules: {
      pageHeader: {
        pageTitle: 'Biometrie Termin verschieben',
        leadText: 'Lead: ExtraBold Interessierte können ab sofort die Genauigkeit ihrer Smartphones und Navigationsgeräte überprüfen. Die Baudirektion hat beim Landesmuseum in Zürich einen Kontrollpunkt beim Landesmuseum in Zürich einen Kontrollpunkt für mobile Geräte eingerichtet – den ersten in der Schweiz.',
        breadcrumb: defBreadcrumbData,
        inverted: true,
        hasImageTitle: false,
        hasVideo: false,
        hasImage: false,
        hasBacklink: false,
        hasBreadcrumb: true,
        noButton: true,
      },
      instructions: defInstructionsData,
      contact: contactData,
      footerData: defFooterData,
      back2topData: _.merge({}, defBack2TopData, { preserveLangSwitch: false }),
    },
  },
});

module.exports = data;
