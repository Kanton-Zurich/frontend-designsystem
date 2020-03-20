const _ = require('lodash');
const defaultData = require('../../data/default.data.js');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.default.props;
const headerData = require('../../modules/header/header.data').props;

const defPageHeaderData = require('../../modules/page_header/page_header.data.js').variants.colored.props;
const defTopicListData = require('../../modules/topiclist/topiclist.data.js').variants.default.props;
const defTeaserData = require('../../modules/teaser/teaser.data.js').variants.inverted.props;
const defSPAData = require('../../modules/application/application.data.js').variants.default.props;
const defiframeData = require('../../modules/iframe/iframe.data.js').variants.default.props;
const contentTeaserDataWithoutBuzzwords = require('../../atoms/content_teaser/content_teaser.data').variants.withoutBuzzwords.props;
const dataHelper = require('@unic/estatico-data');
const contextMenuProps = require('../../modules/context_menu/context_menu.data').props;
const contextMenuItemDef = require('../../atoms/context_menu_item/context_menu_item.data').variants.default.props;
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const defBack2TopData = require('../../modules/back2top/back2top.data').variants.default.props;

const defStepperForm = require('../../modules/stepper/stepper.data').variants.withEmptyStepAndlogic.props;

const defPageHeaderCustomData = {
  pageTitle: 'biz Kloten',
  leadText: 'Gerne unterstützen wir Sie bei der Berufs- und Studienwahl sowie bei der Gestaltung Ihrer beruflichen Laufbahn',
  noButton: true,
  breadcrumb: {
    contextMenu: _.merge({}, contextMenuProps, {
      lists: [
        {
          items: [
            _.merge({}, contextMenuItemDef, { text: 'Kanton Zürich', iconAfter: false, iconBefore: false }),
            _.merge({}, contextMenuItemDef, { text: '...', iconAfter: false, iconBefore: false }),
            _.merge({}, contextMenuItemDef, { text: 'Amt für Jugend und Berufsberatung', iconAfter: false, iconBefore: false }),
            _.merge({}, contextMenuItemDef, { text: 'Standorte', iconAfter: false, iconBefore: false }),
          ],
        },
      ],
    }),
    path: [
      {
        title: 'Kanton Zürich',
        href: '#',
      },
      {
        title: '...',
        href: '#',
      },
      {
        title: 'Amt für Jugend und Berufsberatung',
        href: '#',
      },
      {
        title: 'Standorte',
        href: '#',
      },
      {
        title: 'biz Klotzen',
      },
    ],
  },
};
const defAnchorNavData = {
  anchornavTitle: {
    level: 5,
    title: 'Inhaltsverzeichnis',
  },
  anchornavItems: [
    {
      anchorlink: {
        anchorlinkText: 'Themen',
        anchorlinkAdress: 'ourtopics',
        anchorlinkIsActive: true,
        anchorlinkAsButton: true,
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Veranstaltungen',
        anchorlinkAdress: 'eventsTODO',
        anchorlinkIsActive: false,
        anchorlinkAsButton: true,
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Kontakt',
        anchorlinkAdress: 'contact',
        anchorlinkIsActive: false,
        anchorlinkAsButton: true,
      },
    },
    {
      anchorlink: {
        anchorlinkText: 'Team',
        anchorlinkAdress: 'teamTODO',
        anchorlinkIsActive: false,
        anchorlinkAsButton: true,
      },
    },
  ],
};

const defTopicListCustomData = {
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
  anchorNavReference: 'contact',
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
};

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Einzelseite',
    jira: 'CZHDEV-283',
    content: dataHelper.getFileContent('single.hbs'),
    documentation: dataHelper.getDocumentation('single.md'),
  },
  props: {
    skiplinks: skiplinksData,
    header: headerData,
    title: 'Einzelseite',
    text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
    modules: {
      pageHeaderData: _.merge({}, defPageHeaderData, defPageHeaderCustomData),
      stepperForm: defStepperForm,
    },
  },
});

module.exports = data;
