const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('policy_area_list.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Politikbereichliste',
    className: 'PolicyAreaList',
    jira: 'CZHDEV-3516',
    label: 'Liste',
    documentation: dataHelper.getDocumentation('README.md'),
  },
});

const policyAreas = [
  {
    shortTitle: 'Öffentliche Sicherheit',
    target: '#',
  },
  {
    shortTitle: 'Bildung',
    target: '#',
  },
  {
    shortTitle: 'Kultur, Sport und Freizeit',
    target: '#',
  },
  {
    shortTitle: 'Gesundheit',
    target: '#',
  },
  {
    shortTitle: 'Gesellschaft & soziale Sicherheit',
    target: '#',
  },
  {
    shortTitle: 'Verkehr',
    target: '#',
  },
  {
    shortTitle: 'Umwelt & Raumordnung',
    target: '#',
  },
  {
    shortTitle: 'Volkswirtschaft',
    target: '#',
  },
  {
    shortTitle: 'Finanzen & Steuern',
    target: '#',
  },
  {
    shortTitle: 'Allgemeine Verwaltung',
    target: '#',
  },
];

const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Startseite',
        desc: 'Implementierung für die Startseite.',
      },
      props: {
        isHome: true,
        contentNavData: {
          items: policyAreas,
        },
      },
    },
    notHome: {
      meta: {
        title: 'Andere Seiten',
        desc: 'Implementierung für andere Seiten',
      },
      props: {
        isHome: false,
        heading: {
          level: 2,
          visualLevel: 2,
          title: 'Politikbereiche',
        },
        contentNavData: {
          forceTwoColumns: true,
          items: policyAreas,
        },
      },
    },
  },
  (variant) => {
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
  }
);

data.variants = variants;

module.exports = data;
