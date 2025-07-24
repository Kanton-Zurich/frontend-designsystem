const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const defaultData = require('../../../../data/default.data.js');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultButtonData = require('../../../../atoms/button/button.data').variants.default.props;
const contextMenuItemDef = require('../../../../atoms/context_menu_item/context_menu_item.data')
  .variants.default.props;

const template = dataHelper.getFileContent('details_view.hbs');
const calIcsFileName = 'biometrie_appointment.ics';
const calendarContextMenu = {
  lists: [
    {
      items: [
        _.merge({}, contextMenuItemDef, {
          text: 'iCal',
          iconAfter: false,
          iconBefore: 'download',
          additionalAttributes: `data-biometrie_appointment="cal-link__ics" download="${calIcsFileName}"`,
          isButton: false,
        }),
        _.merge({}, contextMenuItemDef, {
          text: 'Google',
          iconAfter: false,
          iconBefore: 'download',
          additionalAttributes: 'data-biometrie_appointment="cal-link__google" target="_blank"',
          isButton: false,
        }),
        _.merge({}, contextMenuItemDef, {
          text: 'Outlook',
          iconAfter: false,
          iconBefore: 'download',
          additionalAttributes: `data-biometrie_appointment="cal-link__ics" download="${calIcsFileName}"`,
          isButton: false,
        }),
      ],
    },
  ],
};

const successNotification = {
  title: 'Ihr Termin wurde verschoben',
  message:
    '<span data-biometrie_appointment="reservation-details__appointmentDateString"></span>&nbsp;<span data-biometrie_appointment="reservation-details__fromTimeString"></span>&nbsp;&ndash;&nbsp;<span data-biometrie_appointment="reservation-details__untilTimeString"></span>',
  icon: '#confirm',
  isGreen: true,
  button: {
    icon: 'exit',
    additionalAttribute: 'data-biometrie_appointment="alertClose"',
  },
};

const personDataMetablock = {
  rows: [
    {
      columns: [
        {
          label: 'Familienname',
          text: '<span data-biometrie_appointment="reservation-details__lastName"></span>',
        },
        {
          label: 'Vorname',
          text: '<span data-biometrie_appointment="reservation-details__firstName"></span>',
        },
      ],
    },
    {
      columns: [
        {
          label: 'Geburtsdatum',
          text: '<span data-biometrie_appointment="reservation-details__dateOfBirth"></span>',
        },
      ],
    },
  ],
};

const appointmentMetablock = {
  headingLevel: 3,
  title: 'Termin Details',
  hasTopTitle: true,
  rows: [
    {
      columns: [
        {
          label: 'Datum',
          text: '<span data-biometrie_appointment="reservation-details__appointmentDateString"></span>',
        },
        {
          label: 'Uhrzeit',
          text: '<span data-biometrie_appointment="reservation-details__fromTimeString"></span> bis <span data-biometrie_appointment="reservation-details__untilTimeString"></span>',
        },
      ],
    },
  ],
};

const data = _.merge({}, defaultData, {
  props: {
    messages: {
      calLinksDescr: 'Im Kalender speichern',
      calIcsFileName: `${calIcsFileName}`,
      checkList: {
        heading: 'Bringen Sie bitte folgende Unterlagen mit',
        items: [
          'Terminbestätigung',
          'Original Ausländerausweis (ausser bei erstmaligem Gesuch)',
          'Original heimatlicher Reisepass',
          'Geburtsschein (bei Neugeborenen)',
        ],
      },
      confirmationHead: 'Bitte beachten',
      confirmationIntroParagraph:
        'Drucken Sie die neue Terminbestätigung aus und nehmen Sie diese mit an den Termin.',
    },
    personDataMetablock,
    appointmentMetablock,
    successNotification,
    calendarContextMenu,
    calendarMenuToggleBtn: _.merge({}, defaultButtonData, {
      text: 'Im Kalender speichern',
      isSecondary: true,
      icon: 'download',
      additionalAttribute: 'data-biometrie_appointment="toggleCalLinks"',
    }),

    rescheduleBtn: _.merge({}, defaultButtonData, {
      text: 'Termin verschieben',
      isPrimary: true,
      additionalAttribute: 'data-biometrie_appointment="reschedule"',
    }),
    printConfirmationBtn: _.merge({}, defaultButtonData, {
      icon: 'download',
      text: 'Bestätigung herunterladen',
      isPrimary: true,
      additionalAttribute: 'data-biometrie_appointment="printConfirmation"',
    }),
  },
});

const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Default',
        desc: 'Default implementation',
      },
    },
    withMockData: {
      meta: {
        title: 'mit Dummy Daten',
        desc: 'Ansicht gefüllt mit Dummy Daten',
      },
      props: {
        withMockData: true,
        withConfirmation: false,
        personDataMetablock: {
          rows: [
            {
              columns: [
                {
                  label: 'Familienname',
                  text: '<span data-biometrie_appointment="reservation-details__lastName">Russo</span>',
                },
                {
                  label: 'Vorname',
                  text: '<span data-biometrie_appointment="reservation-details__firstName">Maria</span>',
                },
              ],
            },
            {
              columns: [
                {
                  label: 'Geburtsdatum',
                  text: '<span data-biometrie_appointment="reservation-details__dateOfBirth">24.04.1983</span>',
                },
              ],
            },
          ],
        },
        appointmentMetablock: {
          headingLevel: 3,
          title: 'Termin Details',
          hasTopTitle: true,
          rows: [
            {
              columns: [
                {
                  label: 'Datum',
                  text: '<span data-biometrie_appointment="reservation-details__appointmentDateString">Montag 05.08.2019</span>',
                },
                {
                  label: 'Uhrzeit',
                  text: '<span data-biometrie_appointment="reservation-details__fromTimeString">10:45</span> bis <span data-biometrie_appointment="reservation-details__untilTimeString">11:00</span>',
                },
              ],
            },
          ],
        },
      },
    },
    confirmed: {
      meta: {
        title: 'mit Bestätigungsmeldung',
        desc: 'Ansicht gefüllt mit Dummy Daten und Bestätigungsmeldung',
      },
      props: {
        withMockData: true,
        withConfirmation: true,
        personDataMetablock: {
          rows: [
            {
              columns: [
                {
                  label: 'Familienname',
                  text: '<span data-biometrie_appointment="reservation-details__lastName">Russo</span>',
                },
                {
                  label: 'Vorname',
                  text: '<span data-biometrie_appointment="reservation-details__firstName">Maria</span>',
                },
              ],
            },
            {
              columns: [
                {
                  label: 'Geburtsdatum',
                  text: '<span data-biometrie_appointment="reservation-details__dateOfBirth">24.04.1983</span>',
                },
                {},
              ],
            },
          ],
        },
        appointmentMetablock: {
          headingLevel: 3,
          title: 'Termin Details',
          hasTopTitle: true,
          rows: [
            {
              columns: [
                {
                  label: 'Datum',
                  text: '<span data-biometrie_appointment="reservation-details__appointmentDateString">Montag 05.08.2019</span>',
                },
                {
                  label: 'Uhrzeit',
                  text: '<span data-biometrie_appointment="reservation-details__fromTimeString">10:45</span> bis <span data-biometrie_appointment="reservation-details__untilTimeString">11:00</span>',
                },
              ],
            },
          ],
        },
        successNotification: {
          title: 'Ihr Termin wurde verschoben',
          message:
            '<span data-biometrie_appointment="reservation-details__appointmentDateString">Montag 05.08.2019</span>&nbsp;<span data-biometrie_appointment="reservation-details__fromTimeString">' +
            '10:45</span>&nbsp;&ndash;&nbsp;<span data-biometrie_appointment="reservation-details__untilTimeString">11:00</span>',
          icon: '#confirm',
          isGreen: true,
          button: {
            icon: 'exit',
            additionalAttribute: 'data-biometrie_appointment="alertClose"',
          },
        },
      },
    },
  },
  (variant) => {
    const variantProps = _.merge({}, data, variant).props;
    const compiledVariant = () => handlebars.compile(template)(variantProps);
    return _.merge({}, data, variant, {
      meta: {
        demo: compiledVariant,

        code: {
          handlebars: dataHelper.getFormattedHandlebars(template),
          html: dataHelper.getFormattedHtml(compiledVariant()),
          data: dataHelper.getFormattedJson(variantProps),
        },
      },
    });
  }
);

data.variants = variants;

module.exports = data;
