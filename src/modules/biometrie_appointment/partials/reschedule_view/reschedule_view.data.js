const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const defaultData = require('../../../../data/default.data.js');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultButtonData = require('../../../../atoms/button/button.data').variants.default.props;

const template = dataHelper.getFileContent('reschedule_view.hbs');
const data = _.merge({}, defaultData, {
  props: {
    messages: {
      nextOpenSlotHeading: 'Nächster freier Termin',
      slotCapacityMsg: 'An diesem Termin gibt es noch {schalter} freie(n) Schalter.',
      otherSlotsHeading: 'Anderen Termin wählen',
      noOpenSlotsMsg: 'Keine Termine verfügbar',
    },
    scheduleNextBtn: _.merge({}, defaultButtonData, {
      text: 'Termin reservieren',
      isPrimary: true,
      additionalAttribute: 'data-biometrie_appointment="doRescheduleNext"',
    }),
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
    cancelBtn: _.merge({}, defaultButtonData, {
      text: 'Abbrechen',
      isSecondary: true,
      additionalAttribute: 'data-biometrie_appointment="cancelBtn"',
    }),
    scheduleSelectedBtn: _.merge({}, defaultButtonData, {
      text: 'Termin reservieren',
      isPrimary: true,
      additionalAttribute: 'data-biometrie_appointment="doScheduleSelected"',
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
  mockFew: {
    meta: {
      title: 'DEMO mit DummyDaten (wenige)',
      desc: 'Füllt die Ansicht mit Dummy TimeSlots.',
    },
    props: {
      withMockedData: true,
      isMockDataMore: false,
    },
  },
  mockFewAndMuch: {
    meta: {
      title: 'DEMO mit DummyDaten (wenige und viele)',
      desc: 'Füllt die Ansicht mit Dummy TimeSlots.',
    },
    props: {
      withMockedData: true,
      isMockDataMore: true,
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
