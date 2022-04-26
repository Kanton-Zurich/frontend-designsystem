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
    documentation: dataHelper.getDocumentation('README.md'),
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
  noTitleLast: {
    meta: {
      title: 'Without title, and margin bottom',
      desc: 'Implementation without title',
    },
    props: {
      isLast: true,
    },
  },
  noTitleAlt: {
    meta: {
      title: 'Without title, and small margin bottom',
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
  socialCare: {
    meta: {
      title: 'Social Care Linklist (CZHDEV-3005)',
      desc: 'List with links to social care chapters.',
    },
    props: {
      linkListTitle: 'Aufgaben der Gemeinde lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor',
      linkListChapterNumber: '2.2',
      headingLevel: 4,
      links: [
        {
          linkListItemIsTOC: true,
          linkListItemChapterNumber: '2.1.01',
          linkListItemTitle: 'Aufgaben der Sozialbehörde',
          linkListItemHref: '/',
        },
        {
          linkListItemIsTOC: true,
          linkListItemChapterNumber: '2.1.02',
          linkListItemTitle: 'Organisation der Sozialbehörde',
          linkListItemHref: '/',
        },
        {
          linkListItemIsTOC: true,
          linkListItemChapterNumber: '2.1.03',
          linkListItemTitle: 'Organisation generell',
          linkListItemHref: '/pages/zhlex_detail/zhlex_detail.html',
        },
      ],
    },
  },
  socialCareBold: {
    meta: {
      title: 'Social Care Linklist Bold (CZHDEV-3005)',
      desc: 'List with links to social care chapters but no heading, instead a bolded link.',
    },
    props: {
      headingLevel: 2,
      links: [
        {
          linkListItemIsTOC: true,
          linkListItemIsTOCHeading: true,
          linkListItemChapterNumber: '0.2',
          linkListItemTitle: 'Aufgaben der Gemeinde',
          linkListItemHref: '/',
        },
        {
          linkListItemIsTOC: true,
          linkListItemChapterNumber: '2.1.01',
          linkListItemTitle: 'Aufgaben der Sozialbehörde',
          linkListItemHref: '/',
        },
        {
          linkListItemIsTOC: true,
          linkListItemChapterNumber: '2.1.02',
          linkListItemTitle: 'Organisation der Sozialbehörde',
          linkListItemHref: '/',
        },
        {
          linkListItemIsTOC: true,
          linkListItemChapterNumber: '2.1.03',
          linkListItemTitle: 'Organisation generell',
          linkListItemHref: '/pages/zhlex_detail/zhlex_detail.html',
        },
      ],
    },
  },
  tableOfContents: {
    meta: {
      title: 'Table of Contents (CZHDEV-3178)',
      desc: 'create a table of contents on the basis of the SocialCareBold Variant',
    },
    props: {
      linkListTitle: 'In diesem Kapitel',
      headingLevel: 2,
      links: [
        {
          linkListItemIsTOC: true,
          linkListItemIsTOCHeading: true,
          linkListItemChapterNumber: '2.2',
          linkListItemTitle: 'Aufgaben der Gemeinde',
          linkListItemHref: '/',
        },
        {
          linkListItemIsTOC: true,
          linkListItemChapterNumber: '2.1.01',
          linkListItemTitle: 'Aufgaben der Sozialbehörde',
          linkListItemHref: '/',
        },
        {
          linkListItemIsTOC: true,
          linkListItemChapterNumber: '2.1.02',
          linkListItemTitle: 'Organisation der Sozialbehörde',
          linkListItemHref: '/',
        },
        {
          linkListItemIsTOC: true,
          linkListItemChapterNumber: '2.1.03',
          linkListItemTitle: 'Organisation generell',
          linkListItemHref: '/pages/zhlex_detail/zhlex_detail.html',
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
