const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const buttonDefaultData = require('../../atoms/button/button.data').variants.default.props;
const textLinkDefaultData = require('../../atoms/text_link/text_link.data').variants.default.props;
const inputClearButtonSmallWithIconData = require('../../atoms/form_input/form_input.data').variants.clearButtonSmallWithIcon.props;
const locationContactDefault = require('../../modules/contact/contact.data').variants.location.props;

const template = dataHelper.getFileContent('locations.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Standorte',
    className: 'Locations',
    jira: 'CZHDEV-476',
    documentation: dataHelper.getDocumentation('locations.md'),
  },
  props: {
    title: {
      level: 2,
      text: 'Standorte des Strassenverkehrsamtes',
    },
    locationsFormInput: _.merge({}, inputClearButtonSmallWithIconData, {
      label: 'Ort/PLZ eingeben',
      dataSelector: 'data-locations="input"',
    }),
    locationsList: {
      hasTitle: false,
      links: [
        {
          linkListItemIsLocation: true,
          linkListItemDistance: '2,0 km',
          linkListItemTitle: 'Strassenverkehrsamt Kanton Zürich',
          linkListItemLabel: 'Uetlibergstrasse 301, 8036 Zürich',
          domSelector: 'data-locations="listItem"',
          linkListItemHref: false,
        }, {
          linkListItemIsLocation: true,
          linkListItemDistance: '6,4 km',
          linkListItemTitle: 'Strassenverkehrsamt Bassersdorf',
          linkListItemLabel: 'Grindelstrasse 22, 8303 Bassersdorf',
          domSelector: 'data-locations="listItem"',
          linkListItemHref: false,
        }, {
          linkListItemIsLocation: true,
          linkListItemDistance: '6,7 km',
          linkListItemTitle: 'Strassenverkehrsamt Kanton Zürich - Prüfstelle Regensdorf',
          linkListItemLabel: 'Riedthofstrasse 192, 8105 Regensdorf',
          domSelector: 'data-locations="listItem"',
          linkListItemHref: false,
        }, {
          linkListItemIsLocation: true,
          linkListItemDistance: '7,5 km',
          linkListItemTitle: 'Strassenverkehrsamt Kanton Zürich',
          linkListItemLabel: 'Taggenbergstrasse 1, 8408 Winterthur',
          domSelector: 'data-locations="listItem"',
          linkListItemHref: false,
        }, {
          linkListItemIsLocation: true,
          linkListItemDistance: '17,4 km',
          linkListItemTitle: 'Strassenverkehrsamt Kanton Zürich - Prüfstelle Bülach',
          linkListItemLabel: 'Schützenmatt Straße 120, 8180 Bülach',
          domSelector: 'data-locations="listItem"',
          linkListItemHref: false,
        }, {
          linkListItemIsLocation: true,
          linkListItemDistance: '21,9 km',
          linkListItemTitle: 'Strassenverkehrsamt Kanton Zürich - Schifffahrtskontrolle',
          linkListItemLabel: 'Seestrasse 87, 8942 Oberrieden',
          domSelector: 'data-locations="listItem"',
          linkListItemHref: false,
        },
      ],
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
    locationContacts: [
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
    ],
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
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
