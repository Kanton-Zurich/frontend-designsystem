const _ = require('lodash');
const defaultData = require('../../data/default.data.js');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.default.props;
const headerData = require('../../modules/header/header.data').variants.invertedWithUserLoggedOut
  .props;

const defPageHeaderData = require('../../modules/page_header/page_header.data.js').variants.topics
  .props;
const defLeadSectionData = require('../../modules/lead_section/lead_section.data').variants.default
  .props;
const dataHelper = require('@unic/estatico-data');
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const backToData = require('../../modules/back_to/back_to.data').variants.default.props;
const defContactData = require('../../modules/contact/contact.data.js').variants.fullWidthLessData
  .props;

const defStepperForm = require('../../modules/stepper/stepper.data').variants.withEmptyStepAndlogic
  .props;

const defPageHeaderCustomData = {
  pageTitle: 'biz Kloten',
};
const defAnchorNavData = {
  anchornavTitle: {
    level: 5,
    title: 'Auf dieser Seite',
  },
  anchornavItems: [
    {
      anchorlink: {
        anchorlinkText: 'Themen',
        anchorlinkAdress: 'ourtopics',
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Veranstaltungen',
        anchorlinkAdress: 'eventsTODO',
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Kontakt',
        anchorlinkAdress: 'contact_title',
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Team',
        anchorlinkAdress: 'teamTODO',
      },
    },
  ],
};

/* const defTopicListCustomData = {
  contentNavData: _.merge({}, {
    items: [
      _.merge({}, contentTeaserDataWithoutBuzzwords, {
        shortTitle: 'Berufsberatuung für Schülerinnen und Schüler',
      }),
      _.merge({}, contentTeaserDataWithoutBuzzwords, {
        shortTitle: 'SOS-Beratung für Jugendliche',
      }),
      _.merge({}, contentTeaserDataWithoutBuzzwords, {
        shortTitle: 'Berufs- und Laufbahnberatung für Erwachsene',
      }),
      _.merge({}, contentTeaserDataWithoutBuzzwords, {
        shortTitle: 'Laufbahnberatung für Erwerbslose',
      }),
      _.merge({}, contentTeaserDataWithoutBuzzwords, {
        shortTitle: 'Laufbahnberatung für Sozialhilfeempfängerinnen und Sozialhilfeempfänger',
      }),
    ],
  }),
};

const defContactCustomData = {
  fullWidth: true,
  contactTitle: 'Kontakt',
  anchorNavReference: 'contact_title',
  contactAddress: {
    name: 'biz Kloten',
    street: 'Hamelirainstrasse 4',
    zip: '8302',
    city: 'Kloten',
    routeLinkHref: '#',
    routeLinkLabel: 'Route anzeigen',
    openingTimes: [{
      timeTitle: 'Bürozeiten',
      times: [
        { text: 'Mo-Fr: 8.00 - 11:30 &' },
        { text: '13:30 - 17:00' },
      ],
    },
    {
      timeTitle: 'Öffnungszeiten Infothek',
      times: [
        { text: 'Mo./Di./Mi./Fr.: 13.30 - 17:30 &' },
        { text: 'Do.: 13:30 - 19:00' },
      ],
    }],
  },
  contactPhone: [
    {
      anchorLabel: '043 259 82 00',
      phoneNumer: '+41432598200',
      additionalInfo: 'Telefon',
    },
  ],
}; */

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Einzelseite',
    jira: 'CZHDEV-283',
    content: dataHelper.getFileContent('single.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    skiplinks: skiplinksData,
    header: headerData,
    title: 'Einzelseite',
    text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
    modules: {
      pageHeaderData: _.merge({}, defPageHeaderData, defPageHeaderCustomData),
      leadSectionData: defLeadSectionData,
      anchornavData: defAnchorNavData,
      stepperForm: defStepperForm,
      contact: defContactData,
      footerData: defFooterData,
      backToData,
    },
  },
});

module.exports = data;
