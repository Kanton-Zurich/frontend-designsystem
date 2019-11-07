const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const defBreadcrumbData = require('../../modules/breadcrumb/breadcrumb.data.js').variants.default.props;
const defInstructionsData = require('../../modules/instructions/instructions.data.js').variants.serviceDemo.props;
const contactData = require('../../modules/contact/contact.data').variants.fullWidth.props;
const headerData = require('../../modules/header/header.data').props;
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;


const data = _.merge({}, defaultData, {
  meta: {
    title: 'Serviceseite',
    jira: 'CZHDEV-517',
    content: dataHelper.getFileContent('service.hbs'),
    documentation: dataHelper.getDocumentation('service.md'),
  },
  props: {
    header: headerData,
    title: 'Serviceseite',
    text: '',
    defaultColorVariation: 'cv-green',
    modules: {
      pageHeader: {
        pageTitle: 'Führerausweis bestellen',
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
    },
  },
});

module.exports = data;
