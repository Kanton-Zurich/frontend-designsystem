const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const loginViewProps = require('./partials/login_view/login_view.data').props;
const detailsViewProps = require('./partials/details_view/details_view.data').props;


const template = dataHelper.getFileContent('biometrie_appointment.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Appointment (Biometrie)',
    className: 'BiometrieAppointment',
    jira: 'CZHDEV-*',
    documentation: dataHelper.getDocumentation('biometrie_appointment.md'),
  },
  props: {
    apiBase: 'http://localhost:3000/biometrie/',
    heading: 'Termin zur Erfassung der biometrischen Daten verschieben',
    loginViewProps,
    detailsViewProps,
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
});

data.variants = variants;

module.exports = data;
