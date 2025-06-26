const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const demoItems = [
  {
    link: '#',
    heading:
      'Die Struktur der Leistungsgruppe des Kantons überprüfen, um die Aufgabenerfüllung, Kompetenzen und Verantwortung besser abzubilden.',
    withStatus: false,
    headingLevel: 3,
    meta: [
      {
        term: 'RRZ 10a',
        data: 'Allgemeine Verwaltung',
      },
      {
        term: 'Zuständig',
        data: 'Tiefbauamt, Strassenverkehrsamt',
      },
    ],
  },
  {
    link: '#',
    heading:
      'Erarbeitung der Informatikstrategie 2015–2018 mit der Stossrichtung Standardisierung, Professionalisierung und Automatisierung der direktionsübergreifenden IT-Services sowie der Stossrichtung Voraussetzung schaffen für die komplette Digitalisierung in den Direktionen.',
    withStatus: false,
    headingLevel: 3,
    meta: [
      {
        term: 'RRZ 10a',
        data: 'Allgemeine Verwaltung',
      },
      {
        term: 'Zuständig',
        data: 'Tiefbauamt, Strassenverkehrsamt',
      },
    ],
  },
];

const startedItems = [
  {
    link: '#',
    heading:
      'Die Struktur der Leistungsgruppe des Kantons überprüfen, um die Aufgabenerfüllung, Kompetenzen und Verantwortung besser abzubilden.',
    withStatus: true,
    headingLevel: 3,
    status: {
      text: 'Abgeschlossen',
      modifier: 'completed',
      icon: 'confirm',
    },
    meta: [
      {
        term: 'RRZ 10a',
        data: 'Allgemeine Verwaltung',
      },
      {
        term: 'Zuständig',
        data: 'Tiefbauamt, Strassenverkehrsamt',
      },
    ],
  },
  {
    link: '#',
    heading: 'Regierungsratsgeschäfte und Mitberichtsverfahren medienbruchfrei abwickeln.',
    withStatus: true,
    headingLevel: 3,
    status: {
      text: 'Planmässig',
      modifier: 'on-schedule',
      icon: 'locate',
    },
    meta: [
      {
        term: 'RRZ 10a',
        data: 'Allgemeine Verwaltung',
      },
      {
        term: 'Zuständig',
        data: 'Tiefbauamt, Strassenverkehrsamt',
      },
    ],
  },
  {
    link: '#',
    heading:
      'Die Richtlinien des Regierungsrates vom 29. Januar 2014 über die Public Corporate Governance umsetzen.',
    withStatus: true,
    headingLevel: 3,
    status: {
      text: 'Verzögert',
      modifier: 'delayed',
      icon: 'alert',
    },
    meta: [
      {
        term: 'RRZ 10a',
        data: 'Allgemeine Verwaltung',
      },
      {
        term: 'Zuständig',
        data: 'Tiefbauamt, Strassenverkehrsamt',
      },
    ],
  },
  {
    link: '#',
    heading:
      'Erarbeitung der Informatikstrategie 2015–2018 mit der Stossrichtung Standardisierung, Professionalisierung und Automatisierung der direktionsübergreifenden IT-Services sowie der Stossrichtung Voraussetzung schaffen für die komplette Digitalisierung in den Direktionen.',
    withStatus: true,
    headingLevel: 3,
    status: {
      text: 'Verzicht',
      modifier: 'abandoned',
      icon: 'block',
    },
    meta: [
      {
        term: 'RRZ 10a',
        data: 'Allgemeine Verwaltung',
      },
      {
        term: 'Zuständig',
        data: 'Tiefbauamt, Strassenverkehrsamt',
      },
    ],
  },
  {
    link: '#',
    heading:
      'Erarbeitung der Informatikstrategie 2015–2018 mit der Stossrichtung Standardisierung, Professionalisierung und Automatisierung der direktionsübergreifenden IT-Services sowie der Stossrichtung Voraussetzung schaffen für die komplette Digitalisierung in den Direktionen.',
    withStatus: true,
    headingLevel: 3,
    status: {
      text: 'Sistiert',
      modifier: 'paused',
      icon: 'pause',
    },
    meta: [
      {
        term: 'RRZ 10a',
        data: 'Allgemeine Verwaltung',
      },
      {
        term: 'Zuständig',
        data: 'Tiefbauamt, Strassenverkehrsamt',
      },
    ],
  },
];

const template = dataHelper.getFileContent('measures_list.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Massnahmenliste',
    className: 'MeasuresList',
    jira: 'CZHDEV-3474',
    label: 'Liste',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    measuresListItems: demoItems,
  },
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Nicht gestartete Massnahmen',
        desc: 'Massnahmen nicht gestartet; mit H2, dargestellt als H3.',
      },
      props: {
        heading: {
          title: 'Massnahmen',
        },
        measuresListItems: demoItems,
      },
    },
    hasStarted: {
      meta: {
        title: 'Gestartete Massnahmen',
        desc: 'Massnahmen gestartet.',
      },
      props: {
        measuresListItems: startedItems,
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
