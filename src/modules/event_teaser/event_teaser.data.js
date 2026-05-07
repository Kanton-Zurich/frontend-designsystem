const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const textLinkData = require('../../atoms/text_link/text_link.data');

const template = dataHelper.getFileContent('event_teaser.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Veranstaltungsteaser',
    className: 'EventTeaser',
    jira: 'CZHDEV-4948',
    label: 'Teaser',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    heading: {
      level: 2,
      visualLevel: 2,
      title: 'Nächste Veranstaltungen',
    },
    // No eventCards here - they will be rendered dynamically by JavaScript
    eventCards: [],
    // Data attributes for JavaScript module
    apiUrl: '../../mocks/modules/event_teaser/event_teaser.json',
    organizerId: 'c24f3524-770d-421f-512d-08de184bc319',
    attributeOptionIds:
      'e3275478-7e57-4517-e57a-08de184bc33f,e28c8076-cffc-4c6d-e57b-08de184bc33f,ee64b91a-8ed7-423c-e57c-08de184bc33f',
    pageSize: 5,
    i18nLabels: JSON.stringify({
      free: 'kostenlos',
      remote: 'Online',
      waitingList: 'Warteliste vorhanden',
      fullyBooked: 'Ausgebucht',
    }),
    placeholder: {
      text: 'Leider haben wir aktuell keine Veranstaltungen für Sie im Angebot.',
    },
    notification: {
      message: 'Beim Laden der Daten ist ein Fehler aufgetreten!',
    },
    textLink: _.merge({}, textLinkData.variants.default.props, {
      icon: 'arrow-right',
      text: 'Alle Veranstaltungen',
      hasLeadingIcon: false,
      hasTrailingIcon: true,
    }),
  },
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Default',
        desc: 'Events von Mockdaten',
      },
    },
    withH3Heading: {
      meta: {
        title: 'Mit Überschrift Level 3',
        desc: 'Events von der VMT Int API',
      },
      props: {
        apiUrl: 'https://vmt-int.zh.ch/api/Event/Paged/',
        organizerId: '91c6496f-a778-495a-d029-08de38d98cf7',
        heading: {
          level: 3,
          visualLevel: 3,
          title: 'Nächste Veranstaltungen',
        },
      },
    },
    noEvents: {
      meta: {
        title: 'Keine Veranstaltungen',
        desc: 'Events mit leerer Datenquelle (Mockdaten)',
      },
      props: {
        // No eventCards here - they will be rendered dynamically by JavaScript
        eventCards: [],
        apiUrl: '../../mocks/modules/event_teaser/no-events.json',
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
