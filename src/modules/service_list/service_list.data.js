const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const {handlebars} = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defModalData0 = require('../modal/modal.data.js').variants.default.props;
const defModalData1 = require('../modal/modal.data.js').variants.minimal.props;

const template = dataHelper.getFileContent('service_list.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Service Liste',
    className: 'MdlServiceList',
    jira: 'CZHDEV-174',
    documentation: dataHelper.getDocumentation('service_list.md'),
  },
  props: {
    headingText: 'Service',
    items: [
      {
        title: 'Service Titel',
        buttonTitle: 'Start',
        serviceLink: '',
        modalData: _.merge({}, defModalData0, { modalId: 'service-modal0', preview: false }),
      },
      {
        title: 'Service Titel',
        buttonTitle: 'Start',
        serviceLink: '',
        modalData: _.merge({}, defModalData1, { modalId: 'service-modal1', preview: false }),
      },
      {
        title: 'Terminverschiebung periodische Fahrzeugprüfung',
        buttonTitle: 'Start',
        serviceLink: '',
        modalData: _.merge({}, defModalData0, { modalId: 'service-modal2', preview: false }),
      },
      {
        title: 'Internationalen Führerschein beantragen',
        text: 'In nicht englischsprachigen Ländern ausserhalb der EU empfehlen wir Ihnen, einen internationalen Führerschein ausstellen zu lassen.',
        buttonTitle: 'Start',
        serviceLink: '#',
        external: true,
      },
    ],
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
    props: {
      hasHeading: true,
    },
  },
  noHeading: {
    meta: {
      title: 'Ohne Titel',
      desc: '',
    },
    props: {
      hasHeading: false,
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
