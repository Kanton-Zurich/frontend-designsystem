const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('linklist.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Link-Liste',
    className: 'Linklist',
    jira: 'CZHDEV-187',
    label: 'Liste',
    documentation: dataHelper.getDocumentation('linklist.md'),
  },
  props: {
    links: [
      {
        linkListItemTitle: 'Link 1',
        linkListItemHref: '/',
      }, {
        linkListItemTitle: 'Link 2',
        linkListItemHref: 'https://www.google.ch',
        target: 'blank',
      }, {
        linkListItemTitle: 'Link 3',
        linkListItemHref: '/index.html',
      },
    ],

  },
});


const variants = _.mapValues({
  default: {
    meta: {
      title: 'With H2',
      desc: 'Implementation with h2 title',
    },
    props: {
      linkListTitle: 'Linkliste',
      headingLevel: 2,
    },
  },
  h3: {
    meta: {
      title: 'With H3',
      desc: 'Implementation with h3 title',
    },
    props: {
      linkListTitle: 'Linkliste',
      headingLevel: 3,
    },
  },
  h4: {
    meta: {
      title: 'With H4',
      desc: 'Implementation with H4',
    },
    props: {
      linkListTitle: 'Linkliste',
      headingLevel: 4,
    },
  },
  noTitle: {
    meta: {
      title: 'Without title',
      desc: 'Implementation without title',
    },
  },
  noTitleAlt: {
    meta: {
      title: 'Without title',
      desc: 'Implementation without title',
    },
    props: {
      smallMargin: true,
      links: [
        {
          linkListItemTitle: 'Gesetz über das Bürgerrecht',
          linkListItemHref: '/',
        },
        {
          linkListItemTitle: 'Gesetz über die Auslagerung von Informatikdienstleistungen',
          linkListItemHref: '/',
        },
        {
          linkListItemTitle: 'Gesetz über das Schlichtungsverfahren für Streitigkeiten nach Gleichstellungsgesetz in öffentlich-rechtlichen Arbeitsverhältnissen',
          linkListItemHref: '/',
        },
        {
          linkListItemTitle: 'Gesetz über die Verselbstständigung der Versicherungskasse für das Staatspersonal',
          linkListItemHref: '/',
        },
      ],
    },
  },
  locations: {
    meta: {
      title: 'With locations',
      desc: 'Linklist as used in locations module',
    },
    props: {
      hasIndex: true,
      links: [
        {
          linkListItemIsLocation: true,
          linkListItemDistance: '2,0 km',
          linkListItemTitle: 'Strassenverkehrsamt Kanton Zürich',
          linkListItemLabel: 'Uetlibergstrasse 301, 8036 Zürich',
          linkListItemHref: '/',
        }, {
          linkListItemIsLocation: true,
          linkListItemDistance: '6,4 km',
          linkListItemTitle: 'Strassenverkehrsamt Bassersdorf',
          linkListItemLabel: 'Grindelstrasse 22, 8303 Bassersdorf',
          linkListItemHref: '/',
        }, {
          linkListItemIsLocation: true,
          linkListItemDistance: '6,7 km',
          linkListItemTitle: 'Strassenverkehrsamt Kanton Zürich - Prüfstelle Regensdorf',
          linkListItemLabel: 'Riedthofstrasse 192, 8105 Regensdorf',
          linkListItemHref: '/',
        }, {
          linkListItemIsLocation: true,
          linkListItemDistance: '7,5 km',
          linkListItemTitle: 'Strassenverkehrsamt Kanton Zürich',
          linkListItemLabel: 'Taggenbergstrasse 1, 8408 Winterthur',
          linkListItemHref: '/',
        }, {
          linkListItemIsLocation: true,
          linkListItemDistance: '17,4 km',
          linkListItemTitle: 'Strassenverkehrsamt Kanton Zürich - Prüfstelle Bülach',
          linkListItemLabel: 'Schützenmatt Straße 120, 8180 Bülach',
          linkListItemHref: '/',
        }, {
          linkListItemIsLocation: true,
          linkListItemDistance: '21,9 km',
          linkListItemTitle: 'Strassenverkehrsamt Kanton Zürich - Schifffahrtskontrolle',
          linkListItemLabel: 'Seestrasse 87, 8942 Oberrieden',
          linkListItemHref: '/',
        },
      ],
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
        data: dataHelper.getFormattedJson(variantProps),
        html: dataHelper.getFormattedHtml(compiledVariant()),
      },
    },
  });

  return variantData;
});

data.variants = variants;

module.exports = data;
