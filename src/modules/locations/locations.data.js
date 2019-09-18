const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const buttonDefaultData = require('../../atoms/button/button.data').variants.default.props;
const inputClearButtonSmallWithIconData = require('../../atoms/form_input/form_input.data').variants.clearButtonSmallWithIcon.props;

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
    detailedLocations: [
      {
        heading: 'Strassenverkehrsamt Kanton Zürich',
        href: 'https://stva.zh.ch/internet/sicherheitsdirektion/stva/de/home.html',
      }, {
        heading: 'Strassenverkehrsamt Bassersdorf',
        href: 'https://stva.zh.ch/internet/sicherheitsdirektion/stva/de/ueber_uns/organisation/StVA_Gt.html',
      }, {
        heading: 'Strassenverkehrsamt Kanton Zürich - Prüfstelle Regensdorf',
      }, {
        heading: 'Strassenverkehrsamt Kanton Zürich',
      }, {
        heading: 'Strassenverkehrsamt Kanton Zürich - Prüfstelle Bülach',
      }, {
        heading: 'Strassenverkehrsamt Kanton Zürich - Schifffahrtskontrolle',
      },
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
