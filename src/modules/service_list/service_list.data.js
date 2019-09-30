const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('service_list.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Service Liste',
    className: 'MdlServiceList',
    jira: 'CZHDEV-174',
    label: 'List',
    documentation: dataHelper.getDocumentation('service_list.md'),
  },
  props: {
    headingText: 'Service',
    items: [
      {
        title: 'Service Titel',
        buttonTitle: 'Start',
        serviceLink: 'service_page.mock.html',
        href: '../../pages/service/service.html',
        modalData: { modalId: 'service-modal0' },
      },
      {
        title: 'Service Titel',
        buttonTitle: 'Start',
        serviceLink: 'service_page.mock.html',
        href: '../../pages/service/service.html',
        modalData: { modalId: 'service-modal1' },
      },
      {
        title: 'Terminverschiebung periodische Fahrzeugprüfung',
        buttonTitle: 'Start',
        serviceLink: 'service_page.mock.html',
        href: '../../pages/service/service.html',
        modalData: { modalId: 'service-modal2' },
      },
      {
        title: 'App Titel',
        buttonTitle: 'Start',
        serviceLink: '../application/modalexample.mock.html',
        href: '../../pages/application/application.html',
        staticHeader: true,
        modalData: { modalId: 'app-modal1' },
      },
      {
        title: 'Internationalen Führerschein beantragen',
        text: 'In nicht englischsprachigen Ländern ausserhalb der EU empfehlen wir Ihnen, einen internationalen Führerschein ausstellen zu lassen.',
        buttonTitle: 'Start',
        href: '../../pages/service/service.html',
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
      serviceListHeading: {
        title: 'Service',
      },
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
