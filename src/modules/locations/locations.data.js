const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const buttonDefaultData = require('../../atoms/button/button.data').variants.default.props;
const textLinkDefaultData = require('../../atoms/text_link/text_link.data').variants.default.props;
const inputClearButtonSmallWithIconData = require('../../atoms/form_input/form_input.data').variants.clearButtonSmallWithIcon.props;
const mapViewDefaultData = require('../../modules/map_view/map_view.data').variants.default.props;
const locationContactDefault = require('../../modules/contact/contact.data').variants.location.props;

const locationsLatLng = [
  { lat: 47.353611, lng: 8.512877 },
  { lat: 47.444240, lng: 8.613319 },
  { lat: 47.441567, lng: 8.461398 },
  { lat: 47.515148, lng: 8.693981 },
  { lat: 47.532225, lng: 8.527852 },
  { lat: 47.271530, lng: 8.585463 },
];

const locationsAsListItemLinks = [
  {
    linkListItemIsLocation: true,
    linkListItemTitle: 'Strassenverkehrsamt Kanton Zürich',
    linkListItemLabel: 'Uetlibergstrasse 301, 8036 Zürich',
    additionalAttributes: 'data-locations="listItem"',
    linkListItemHref: false,
  }, {
    linkListItemIsLocation: true,
    linkListItemTitle: 'Strassenverkehrsamt Bassersdorf',
    linkListItemLabel: 'Grindelstrasse 22, 8303 Bassersdorf',
    additionalAttributes: 'data-locations="listItem"',
    linkListItemHref: false,
  }, {
    linkListItemIsLocation: true,
    linkListItemTitle: 'Strassenverkehrsamt Kanton Zürich - Prüfstelle Regensdorf',
    linkListItemLabel: 'Riedthofstrasse 192, 8105 Regensdorf',
    additionalAttributes: 'data-locations="listItem"',
    linkListItemHref: false,
  }, {
    linkListItemIsLocation: true,
    linkListItemTitle: 'Strassenverkehrsamt Kanton Zürich',
    linkListItemLabel: 'Taggenbergstrasse 1, 8408 Winterthur',
    additionalAttributes: 'data-locations="listItem"',
    linkListItemHref: false,
  }, {
    linkListItemIsLocation: true,
    linkListItemTitle: 'Strassenverkehrsamt Kanton Zürich - Prüfstelle Bülach',
    linkListItemLabel: 'Schützenmatt Straße 120, 8180 Bülach',
    additionalAttributes: 'data-locations="listItem"',
    linkListItemHref: false,
  }, {
    linkListItemIsLocation: true,
    linkListItemTitle: 'Strassenverkehrsamt Kanton Zürich - Schifffahrtskontrolle',
    linkListItemLabel: 'Seestrasse 87, 8942 Oberrieden',
    additionalAttributes: 'data-locations="listItem"',
    linkListItemHref: false,
  },
];
const locationsAsContacts = [
  _.merge({}, locationContactDefault, {
    contactSubtitle: 'Strassenverkehrsamt Kanton Zürich',
    contactAddress: {
      street: 'Uetlibergstrasse 301',
      zip: '8036',
      city: 'Zürich',
    },
  }),
  _.merge({}, locationContactDefault, {
    contactSubtitle: 'Strassenverkehrsamt Bassersdorf',
    contactAddress: {
      street: 'Grindelstrasse 22',
      zip: '8303',
      city: 'Bassersdorf',
    },
  }),
  _.merge({}, locationContactDefault, {
    contactSubtitle: 'Strassenverkehrsamt Kanton Zürich - Prüfstelle Regensdorf',
    contactAddress: {
      street: 'Riedthofstrasse 192',
      name: 'Postfach 420',
      zip: '8105',
      city: 'Regensdorf',
    },
  }),
  _.merge({}, locationContactDefault, {
    contactSubtitle: 'Strassenverkehrsamt Kanton Zürich',
    contactAddress: {
      street: 'Taggenbergstrasse 1',
      zip: '8408',
      city: 'Winterthur',
    },
  }),
  _.merge({}, locationContactDefault, {
    contactSubtitle: 'Strassenverkehrsamt Kanton Zürich - Prüfstelle Bülach',
    contactAddress: {
      street: 'Schützenmatt Straße 120',
      zip: '8180',
      city: 'Bülach',
    },
  }),
  _.merge({}, locationContactDefault, {
    contactSubtitle: 'Strassenverkehrsamt Kanton Zürich - Schifffahrtskontrolle',
    contactAddress: {
      street: 'Seestrasse 87',
      zip: '8942',
      city: 'Oberrieden',
    },
  }),
];

const template = dataHelper.getFileContent('locations.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Standorte',
    className: 'Locations',
    jira: 'CZHDEV-476',
    label: 'Komplex',
    documentation: dataHelper.getDocumentation('locations.md'),
  },
  props: {
    title: {
      level: 2,
      text: 'Standorte des Strassenverkehrsamtes',
    },
    noPlzFound: 'Keine PLZ / Ort gefunden',
    locationsFormInput: _.merge({}, inputClearButtonSmallWithIconData, {
      label: 'Standorte filter',
      dataSelector: 'data-locations="input"',
      type: 'text',
      additionalFunctionality: {
        icon: 'clear',
        buttontype: 'clear',
        ariaText: 'Lösche Eingabe',
      },
    }),
    locationsList: {
      hasIndex: true,
      hasTitle: false,
      links: [],
    },
    backBtn: _.merge({}, buttonDefaultData, {
      isSecondary: true,
      isSmall: true,
      additionalAttribute: 'data-locations="back"',
      text: 'Zurück',
    }),
    textLinkNoResult: _.merge({}, textLinkDefaultData, {
      icon: 'search',
      text: 'Gesamte Webseite nach «{searchTerm}» durchsuchen',
      additionalAttribute: 'data-locations="emptyNote"',
      isInverted: false,
      hasLeadingIcon: true,
      hasTrailingIcon: false,
    }),
    toggleListBtn: _.merge({}, buttonDefaultData, {
      isTextVisible: false,
      isInverted: true,
      icon: 'menu-list',
      text: 'anzeigen',
      additionalAttribute: 'data-locations="toggleList"',
    }),
    locationContacts: [],
    mapData: _.merge({}, mapViewDefaultData, {
      withUserLocate: true,
      mapMarker: [],
    }),
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
    props: {
      locationsList: {
        hasIndex: true,
        links: locationsAsListItemLinks,
      },
      locationContacts: locationsAsContacts,
      mapData: {
        mapId: _.uniqueId('locations_map'),
        mapMarker: locationsLatLng,
      },
    },
  },
  singleLocation: {
    meta: {
      title: 'Only one',
      desc: 'Shows module with only one single location entry.',
    },
    props: {
      locationsList: {
        hasIndex: true,
        links: [locationsAsListItemLinks[0]],
      },
      locationContacts: [locationsAsContacts[0]],
      mapData: {
        mapId: _.uniqueId('locations_map'),
        mapMarker: [locationsLatLng[0]],
      },
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
