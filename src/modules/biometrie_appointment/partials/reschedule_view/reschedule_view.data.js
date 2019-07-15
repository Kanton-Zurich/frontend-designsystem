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
      otherSlotsHeading: 'Anderen Termin wählen',
    },
    scheduleNextBtn: _.merge({}, defaultButtonData, {
      text: 'Termin reservieren',
      isPrimary: true,
      additionalAttribute: 'data-biometrie_appointment="doRescheduleNext"',
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
