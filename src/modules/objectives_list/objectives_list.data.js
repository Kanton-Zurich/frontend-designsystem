const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('objectives_list.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Zielliste',
    className: 'objectivesList',
    jira: 'CZHDEV-3468',
    label: 'Liste',
    documentation: dataHelper.getDocumentation('README.md'),
  },
});

const demoDefaultItems = [
  {
    link: '#',
    label: 'Langfristiges Ziel',
    id: 'LFZ 10.1',
    title:
      'Der Kanton ist zweckmässig und wirtschaftlich organisiert. Er erbringt seine Dienstleistungen bürgernah.',
  },
  {
    link: '#',
    label: 'Legislaturziel',
    id: 'LFZ 10.1',
    title:
      'Der Kanton ist zweckmässig und wirtschaftlich organisiert. Er erbringt seine Dienstleistungen bürgernah.',
  },
  {
    link: '#',
    label: 'Langfristiges Ziel',
    id: 'LFZ 12.4',
    title: 'Dies ist ein inaktives langfristiges Ziel',
    inactive: true,
  },
];

const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Standard',
        desc: 'Default implementation',
      },
      props: {
        objectivesListItems: demoDefaultItems,
      },
    },
    singleItem: {
      meta: {
        title: 'Single Item',
        desc: 'Nur ein Item',
      },
      props: {
        singleItem: true,
        objectivesListItems: [demoDefaultItems[0]],
      },
    },
    withH2: {
      meta: {
        title: 'Mit H2',
        desc: 'Implementation mit H2-Titel',
      },
      props: {
        heading: {
          title: 'Langfristige Ziele',
        },
        objectivesListItems: demoDefaultItems,
      },
    },
    singleItemWithH2: {
      meta: {
        title: 'Ein Ziel mit H2',
        desc: 'Nur ein Ziel mit H2-Titel',
      },
      props: {
        heading: {
          title: 'Legislaturziel',
        },
        singleItem: true,
        objectivesListItems: [demoDefaultItems[0]],
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
