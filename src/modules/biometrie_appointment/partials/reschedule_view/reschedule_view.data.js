const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const defaultData = require('../../../../data/default.data.js');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultButtonData = require('../../../../atoms/button/button.data').variants.default.props;

const slotFullNotification = {
  message: 'Diesen Termin hat soeben jemand reserviert. Er ist nicht mehr verfügbar.',
  icon: '#caution',
  button: {
    icon: 'exit',
    additionalAttribute: 'data-biometrie_appointment="alertClose"',
  },
};

const template = dataHelper.getFileContent('reschedule_view.hbs');
const data = _.merge({}, defaultData, {
  props: {
    messages: {
      slotCapacityMsg: 'An diesem Termin gibt es noch {schalter} freie(n) Schalter.',
      otherSlotsHeading: 'Termin wählen',
      noOpenSlotsMsg: 'Keine Termine',
    },
    slotFullNotification,
    nextWeekBtn: _.merge({}, defaultButtonData, {
      isTextVisible: false,
      isSecondary: true,
      icon: 'angle_right',
      additionalAttribute: 'data-biometrie_appointment="toNextWeek"',
    }),
    prevWeekBtn: _.merge({}, defaultButtonData, {
      isTextVisible: false,
      isSecondary: true,
      icon: 'angle_left',
      additionalAttribute: 'data-biometrie_appointment="toPrevWeek"',
    }),
    slotSelectBtn: _.merge({}, defaultButtonData, {
      text: '{timeslot-range}',
      isSecondary: true,
      isSmall: true,
      additionalAttribute: 'data-biometrie_appointment="timeSlotSelect"',
    }),
    scheduleSelectedBtn: _.merge({}, defaultButtonData, {
      text: 'Termin reservieren',
      isPrimary: true,
      additionalClasses: 'selection-details__select-btn',
      additionalAttribute: 'data-biometrie_appointment="doScheduleSelected"',
    }),
    closeBlockedInfoBtn: _.merge({}, defaultButtonData, {
      text: 'Anderen Termin auswählen',
      isPrimary: true,
      isSmall: true,
      additionalAttribute: 'data-biometrie_appointment="cancelBtn"',
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
  mockData: {
    meta: {
      title: 'DEMO mit DummyDaten',
      desc: 'Füllt die Ansicht mit Dummy TimeSlots.',
    },
    props: {
      withMockedData: true,
      isSlotFull: false,
    },
  },
  demoSlotFull: {
    meta: {
      title: 'DEMO Slotfull',
      desc: 'Zeigt die Meldung für den Fall, dass der angefragte Timeslot ausgebucht ist.',
    },
    props: {
      withMockedData: true,
      isSlotFull: true,
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
