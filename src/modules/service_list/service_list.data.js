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
    label: 'Liste',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    heading: {
      level: 2,
      visualLevel: 2,
      title: 'Services',
    },
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
        icon: 'lock',
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
        text: 'In nicht englischsprachigen Ländern ausserhalb der EU empfehlen wir Ihnen, einen internationalen Führerschein ausstellen zu lassen. In nicht englischsprachigen Ländern ausserhalb der EU empfehlen wir Ihnen, einen internationalen Führerschein ausstellen zu lassen. In nicht englischsprachigen Ländern ausserhalb der EU empfehlen wir Ihnen, einen internationalen Führerschein ausstellen zu lassen.',
        buttonTitle: 'Start',
        href: '../../pages/service/service.html',
        external: true,
      },
      {
        title: 'Appointment (Biometrie)',
        buttonTitle: 'Termin verschieben',
        serviceLink: '../biometrie_appointment/biometrie_appointment_page.mock.html',
        staticHeader: true,
        modalData: { modalId: 'service-modal4' },
      },
    ],
  },
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Default',
        desc: 'Default implementation',
      },
      props: {
        heading: {
          lebel: 2,
          visualLevel: 2,
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
        serviceListHeading: false,
      },
    },
    h3Style: {
      meta: {
        title: 'H3 Style',
        desc: 'Implementierung mit H3 Style',
      },
      props: {
        heading: {
          level: 2,
          visualLevel: 3,
          title: 'Services',
        },
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
