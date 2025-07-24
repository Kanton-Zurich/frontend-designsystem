const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defServiceButtonData = require('../service_button/service_button.data.js').props;

const template = dataHelper.getFileContent('lead_section.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Lead Section',
    className: 'LeadSection',
    jira: 'CZHDEV-2780',
    label: 'Layout',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    leadText:
      'Lead: ExtraBold Interessierte können ab sofort die Genauigkeit ihrer Smartphones und Navigationsgeräte überprüfen. Die Baudirektion hat beim Landesmuseum in Zürich einen Kontrollpunkt beim Landesmuseum in Zürich einen Kontrollpunkt für mobile Geräte eingerichtet – den ersten in der Schweiz.',
  },
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Standard',
        desc: 'Nur Lead-Text',
      },
      props: {
        leadText:
          'Lead: ExtraBold Interessierte können ab sofort die Genauigkeit ihrer Smartphones und Navigationsgeräte überprüfen. Die Baudirektion hat beim Landesmuseum in Zürich einen Kontrollpunkt beim Landesmuseum in Zürich einen Kontrollpunkt für mobile Geräte eingerichtet – den ersten in der Schweiz.',
      },
    },
    defaultNoMargin: {
      meta: {
        title: 'Standard ohne Abstand oben',
        desc: 'Nur Lead-Text ohne Abstand oben',
      },
      props: {
        leadText:
          'Lead: ExtraBold Interessierte können ab sofort die Genauigkeit ihrer Smartphones und Navigationsgeräte überprüfen. Die Baudirektion hat beim Landesmuseum in Zürich einen Kontrollpunkt beim Landesmuseum in Zürich einen Kontrollpunkt für mobile Geräte eingerichtet – den ersten in der Schweiz.',
        noMarginTop: true,
      },
    },
    reports: {
      meta: {
        title: 'Berichte',
        desc: 'Für eine Berichte-Kapitelseite oder -Artikelseite',
      },
      props: {
        leadText:
          'Bericht über den Stand der Aufgabenteilung zwischen Kanton und Gemeinden sowie den Handlungsspielraum der Gemeinden bei der Erfüllung ihrer Aufgaben.',
        newsCategory: 'Gemeinde- und Wirksamkeitsbericht 2021',
        publicationDate: '14.02.2022',
        noMarginTop: true,
      },
    },
    news: {
      meta: {
        title: 'News',
        desc: 'Für eine News-Detailseite',
      },
      props: {
        newsCategory: 'Medienmitteilung',
        publicationDate: '08.01.2019',
        noMarginTop: true,
      },
    },
    service: {
      meta: {
        title: 'Service',
        desc: 'Mit Service-Button',
      },
      props: {
        serviceButtonData: _.merge(defServiceButtonData, {
          buttonTitle: 'Formular beantragen',
          modalData: { modalId: 'service-modal0' },
        }),
      },
    },
    govPlatformStart: {
      meta: {
        title: 'Regierungsplattform Startseite (CZHDEV-3480)',
        disabledColorVariations: ['cv-monochrome'],
        defaultColorVariation: 'cv-blue',
      },
      props: {
        leadText:
          'Der Regierungsrat gibt mit x Legislaturzielen und xx Massnahmen ein ehrgeiziges und umfangreiches politisches Programm vor. Hier folgt noch ein Satz zu den Langfristzielen.',
        isReport: true,
        homeCTA: {
          title: 'Weiterlesen',
          href: '#',
        },
      },
    },
    govPlatformObjective: {
      meta: {
        title: 'Regierungsplattform Ziel (CZHDEV-3492)',
        desc: 'Für eine Ziel-Detailseite',
      },
      props: {
        leadText: '',
        newsCategory: 'Langfristiges Ziel',
        publicationDate: 'LFZ 10.1',
        noMarginTop: true,
      },
    },
    govPlatformMeasure: {
      meta: {
        title: 'Regierungsplattform Massnahme (CZHDEV-3492)',
        desc: 'Für eine Massnahmen-Detailseite',
      },
      props: {
        leadText: '',
        newsCategory: 'Massnahme',
        publicationDate: 'RRZ 10a',
        noMarginTop: true,
      },
    },
    error404: {
      meta: {
        title: 'Fehler 404',
        desc: 'Seite nicht gefunden',
      },
      props: {
        leadText:
          'Bitte wählen Sie über die Hauptnavigation andere Inhalte, versuchen Sie es über die Eingabe eines Suchbegriffs oder wechseln Sie zur Startseite.',
        additionalText: 'Fehlercode: 404',
        homeCTA: { title: 'Zur Startseite', href: '#' },
        noMarginTop: true,
      },
    },
    unavailable: {
      meta: {
        title: 'Wartungsarbeiten',
        desc: 'Seite nicht erreichbar',
      },
      props: {
        leadText:
          'Wir arbeiten gerade an unserer Website. Schauen Sie doch in der Zwischenzeit unseren Imagefilm und versuchen es später nochmals.',
        noMarginTop: true,
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
