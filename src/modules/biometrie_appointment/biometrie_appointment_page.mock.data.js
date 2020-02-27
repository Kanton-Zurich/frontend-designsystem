const biometrieData = require('./biometrie_appointment.data.js');
const dataHelper = require('@unic/estatico-data');

dataHelper.getFileContent('biometrie_appointment_page.mock.hbs');

const data = {
  canonical: 'https://ma.zh.ch/internet/sicherheitsdirektion/migrationsamt/de/einreise_aufenthalt/ausweise_bewilligungsarten/biometrie.html',
  biometrieData: biometrieData.variants.default.props,
  pageHeader: {
    pageTitle: 'Termin verschieben',
    inverted: true,
    hasImageTitle: false,
    hasVideo: false,
    hasImage: false,
    hasBacklink: false,
    hasBreadcrumb: false,
    noButton: true,
    noText: true,
    minimal: true,
    hasCloseButton: true,
  },
};

module.exports = data;
