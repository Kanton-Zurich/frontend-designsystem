const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const defaultData = require('../../../../data/default.data.js');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultButtonData = require('../../../../atoms/button/button.data').variants.default.props;
const contextMenuItemDef = require('../../../../atoms/context_menu_item/context_menu_item.data').variants.default.props;

const template = dataHelper.getFileContent('details_view.hbs');
const calIcsFileName = 'biometrie_appointment.ics';
const calendarContextMenu = {
  lists: [
    {
      items: [
        _.merge({}, contextMenuItemDef, {
          text: 'iCal', iconAfter: false, iconBefore: 'download', additionalAttributes: `data-biometrie_appointment="cal-link__ics" download="${calIcsFileName}"`, isButton: false,
        }),
        _.merge({}, contextMenuItemDef, {
          text: 'Google', iconAfter: false, iconBefore: 'download', additionalAttributes: 'data-biometrie_appointment="cal-link__google" target="_blank"', isButton: false,
        }),
        _.merge({}, contextMenuItemDef, {
          text: 'Outlook', iconAfter: false, iconBefore: 'download', additionalAttributes: `data-biometrie_appointment="cal-link__ics" download="${calIcsFileName}"`, isButton: false,
        }),
      ],
    },
  ],
};

const successNotification = {
  title: 'Ihr Termin wurde verschoben',
  message: '<span data-biometrie_appointment="reservation-details__appointmentDateString"></span>&nbsp;<span data-biometrie_appointment="reservation-details__fromTimeString"></span>&nbsp;&ndash;&nbsp;<span data-biometrie_appointment="reservation-details__untilTimeString"></span>',
  icon: '#confirm',
  isGreen: true,
  isBig: true,
  button: {
    icon: 'exit',
    additionalAttribute: 'data-biometrie_appointment="alertClose"',
  },
};

const data = _.merge({}, defaultData, {
  props: {
    messages: {
      labelLastName: 'Familienname',
      labelFirstName: 'Vorname',
      labelDateOfBirth: 'Geburtsdatum',
      headingAppointment: 'Termin Details',
      labelDate: 'Datum',
      labelTime: 'Uhrzeit',
      fromUntilConjunction: ' bis ',
      calLinksDescr: 'Im Kalender speichern',
      calIcsFileName: `${calIcsFileName}`,

      checkList: {
        heading: 'Bringen Sie bitte folgende Unterlagen mit',
        items: [
          'Terminbestätigung',
          'Original Ausländerausweis (außer bei erstmaligem Gesuch)',
          'Original heimatlicher Reisepass',
          'Geburtsschein (bei Neugeborenen)',
        ],
      },
      rescheduleSuccessHead: 'Ihr Termin wurde verschoben',
      confirmationHead: 'Bitte beachten',
      confirmationIntroParagraph: 'Drucken Sie die neue Terminbestätigung aus und nehmen Sie diese mit an den Termin.',
    },
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

const variants = _.mapValues({
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
      successNotification: {
        title: 'Ihr Termin wurde verschoben',
        message: '<span data-biometrie_appointment="reservation-details__appointmentDateString">Montag 05.08.2019</span>&nbsp;<span data-biometrie_appointment="reservation-details__fromTimeString">'
          + '10:45</span>&nbsp;&ndash;&nbsp;<span data-biometrie_appointment="reservation-details__untilTimeString">11:00</span>',
        icon: '#confirm',
        isGreen: true,
        isBig: true,
        button: {
          icon: 'exit',
          additionalAttribute: 'data-biometrie_appointment="alertClose"',
        },
      },
    },
  },
}, (variant) => {
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
});

data.variants = variants;

module.exports = data;
