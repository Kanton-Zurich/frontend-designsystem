const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('service_card.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Service Card',
    className: 'ServiceCard',
    jira: 'CZHDEV-4789',
    label: 'Teaser',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    detailPageLink: '#',
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
          title: 'Internationalen Führerschein beantragen',
          level: 3,
          visualLevel: 4,
        },
        teaserText:
          'In nicht englischsprachigen Ländern ausserhalb der EU empfehlen wir Ihnen, einen internationalen Führerschein ausstellen zu lassen. In nicht englischsprachigen Ländern ausserhalb der EU empfehlen wir Ihnen, einen internationalen Führerschein ausstellen zu lassen. In nicht englischsprachigen Ländern ausserhalb der EU empfehlen wir Ihnen, einen internationalen Führerschein ausstellen zu lassen.',
        buttonTitle: 'Starten',
        href: '../../pages/service/service.html',
        serviceLink: 'service_page.mock.html',
        modalData: { modalId: 'service-modal0' },
        external: true,
      },
    },
    withIcon: {
      meta: {
        title: 'With Icon',
        desc: 'Icon implementation',
      },
      props: {
        heading: {
          title: 'Internationalen Führerschein beantragen',
          level: 3,
          visualLevel: 4,
        },
        teaserText:
          'In nicht englischsprachigen Ländern ausserhalb der EU empfehlen wir Ihnen, einen internationalen Führerschein ausstellen zu lassen. In nicht englischsprachigen Ländern ausserhalb der EU empfehlen wir Ihnen, einen internationalen Führerschein ausstellen zu lassen. In nicht englischsprachigen Ländern ausserhalb der EU empfehlen wir Ihnen, einen internationalen Führerschein ausstellen zu lassen.',
        buttonTitle: 'Starten',
        href: '../../pages/service/service.html',
        external: true,
        modalData: { modalId: 'service-modal0' },
        icon: 'lock',
      },
    },
    ServiceCardMetaData: {
      meta: {
        title: 'Service Card mit Metadaten',
        desc: 'Service Card mit Metadaten implementation',
      },
      props: {
        heading: {
          title: 'Preisliste Fischerpatente',
          level: 3,
          visualLevel: 4,
        },
        teaserText:
          'In nicht englischsprachigen Ländern ausserhalb der EU empfehlen wir Ihnen, einen internationalen Führerschein ausstellen zu lassen. In nicht englischsprachigen Ländern ausserhalb der EU empfehlen wir Ihnen, einen internationalen Führerschein ausstellen zu lassen. In nicht englischsprachigen Ländern ausserhalb der EU empfehlen wir Ihnen, einen internationalen Führerschein ausstellen zu lassen.',
        metadata: [
          {
            term: 'Massgeblicher Kanal',
            description: 'Kanal xyz',
          },
          {
            term: 'Elektronische Adresse',
            description: 'Das-ist-eine-elektronische-adresse',
          },
          {
            term: 'Dateiformat Eingabe',
            description: 'PDF',
          },
          {
            term: 'Dateiformat Beilagen',
            description: 'PDF, JPG',
          },
        ],
        buttonTitle: 'Starten',
        href: '../../pages/service/service.html',
        external: true,
        icon: 'lock',
      },
    },
    ServiceCardMetaDataWithoutButton: {
      meta: {
        title: 'Service Card mit Metadaten ohne Button',
        desc: 'Service Card mit Metadaten ohne Button implementation',
      },
      props: {
        heading: {
          title: 'Preisliste Fischerpatente',
          level: 3,
          visualLevel: 4,
        },
        teaserText:
          'In nicht englischsprachigen Ländern ausserhalb der EU empfehlen wir Ihnen, einen internationalen Führerschein ausstellen zu lassen. In nicht englischsprachigen Ländern ausserhalb der EU empfehlen wir Ihnen, einen internationalen Führerschein ausstellen zu lassen. In nicht englischsprachigen Ländern ausserhalb der EU empfehlen wir Ihnen, einen internationalen Führerschein ausstellen zu lassen.',
        metadata: [
          {
            term: 'Massgeblicher Kanal',
            description: 'Kanal xyz',
          },
          {
            term: 'Elektronische Adresse',
            description: 'Das-ist-eine-elektronische-adresse',
          },
          {
            term: 'Dateiformat Eingabe',
            description: 'PDF',
          },
          {
            term: 'Dateiformat Beilagen',
            description: 'PDF, JPG',
          },
        ],
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
