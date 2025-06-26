const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const contactEntryData = require('../contact_entry/contact_entry.data');
const accordionData = require('../accordion/accordion.data');

const template = dataHelper.getFileContent('contact.hbs');

const demoAddressTextsDataFullWidth = [
  {
    title: 'Postfach',
    texts: ['Postfach<br>8080 Zürich'],
  },
  {
    title: 'Schalter',
    texts: ['Mo - Mi: 13.30 - 17.30<br>Do: 13:30 - 19:00<br>Fr: 13:30 - 17:30'],
    link: {
      text: 'Andere Kontakte',
    },
  },
];

const demoPhoneTimesData = [
  {
    times: [
      { text: 'Mo-Mi: 13.30 - 17:30' },
      { text: 'Do: 13.30 - 19.00' },
      { text: 'Fr: 13.30 - 17.30' },
    ],
  },
];

const demoCopyButton = {
  label: 'Adresse kopieren',
};

const demoAddressData = {
  name: 'Zürich-Albisgütli',
  street: 'Uetlibergstrasse 301',
  zip: '8036',
  city: 'Zürich',
  routeLinkHref: '#',
  routeLinkLabel: 'Route anzeigen',
  copytoclipboardButton: demoCopyButton,
  additionalInfo: 'Wir befinden uns im 2.Obergeschoss',
  additionalTexts: demoAddressTextsDataFullWidth,
};

const demoAddressDataFullWidth = {
  name: 'Zürich-Albisgütli',
  street: 'Uetlibergstrasse 301',
  zip: '8036',
  city: 'Zürich',
  routeLinkHref: '#',
  routeLinkLabel: 'Route anzeigen',
  copytoclipboardButton: demoCopyButton,
  additionalInfo: 'Wir befinden uns im 2.Obergeschoss',
  additionalTexts: demoAddressTextsDataFullWidth,
};

const demoPhoneDataFullWidth = [
  {
    anchorLabel: '058 811 30 00',
    phoneNumer: '+41588113000',
    additionalInfo: 'Allgemeine Fragen',
    openingTimes: demoPhoneTimesData,
  },
  {
    anchorLabel: '058 811 30 20',
    phoneNumer: '+41588113020',
    additionalInfo: 'Notfall-Nummer',
    additionalInfoSpaced: 'Nur Wochenends von Januar bis Mai',
  },
];

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Kontakt',
    className: 'Contact',
    jira: 'CZHDEV-3295',
    label: 'Komplex',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    contactAriaTitle_location: 'Adresse',
    contactAriaTitle_phone: 'Telefon',
    contactAriaTitle_email: 'E-Mail',
  },
});

const variants = _.mapValues(
  {
    revampedStandard: {
      meta: {
        title: 'CZHDEV-3295 (Variante Standard)',
        desc: 'Kontakt mit Service Link und Adresse-Kopierfunktion, Social-Media Buttons',
      },
      props: {
        fullWidth: true,
        contactTitle: 'Kontakt',
        contactEntry: contactEntryData.variants.revampedStandard.props,
      },
    },
    revampedMedia: {
      meta: {
        title: 'CZHDEV-3295 (Variante Medienkontakt)',
        desc: 'Kontakt mit Medienkontakt, Social-Media Buttons',
      },
      props: {
        fullWidth: true,
        contactTitle: 'Kontakt',
        contactEntry: contactEntryData.variants.revampedStandard.props,
        contactAccordion: accordionData.variants.mediaContact.props,
      },
    },
    multiContacts: {
      meta: {
        title: 'CZHDEV-3295 (Variante mehrere Kontaktadressen)',
        desc: 'Mehrere Kontakte im Akkordeon, erste Adresse offen',
      },
      props: {
        fullWidth: true,
        contactTitle: 'Kontakt',
        contactAccordion: accordionData.variants.multiContact.props,
      },
    },
    revampedService: {
      meta: {
        title: 'CZHDEV-2963 (Variante Service)',
        desc: 'Kontakt klein nur mit Adresse-Kopierfunktion',
      },
      props: {
        contactEntry: {
          entryHeading: {
            title: 'Koordinationsstelle Veloverkehr',
            level: 3,
            href: '#',
          },
          entryAddress: {
            street: 'Uetlibergstrasse 301',
            zip: '8036',
            name: 'Zürich-Albisgütli',
            city: 'Zürich',
            routeLinkHref: '#',
            routeLinkLabel: 'Route anzeigen',
            copytoclipboardButton: demoCopyButton,
          },
        },
      },
    },
    contentFull: {
      meta: contactEntryData.variants.contentFull.meta,
      props: {
        contactEntry: contactEntryData.variants.contentFull.props,
      },
    },
    contentMedium: {
      meta: contactEntryData.variants.contentMedium.meta,
      props: {
        contactEntry: contactEntryData.variants.contentMedium.props,
      },
    },
    contentSmall: {
      meta: contactEntryData.variants.contentSmall.meta,
      props: {
        contactEntry: contactEntryData.variants.contentSmall.props,
      },
    },
    default: {
      meta: {
        title: 'Kontakt klein (nur Adresse)',
        desc: 'Kontakt klein nur mit Adresse',
      },
      props: {
        contactEntry: {
          entryHeading: {
            title: 'Kantonale Heilmittelstelle des Kantons Zürich',
            level: 3,
            href: '#',
          },
          entryAddress: demoAddressData,
        },
      },
    },
    smallMailOnly: {
      meta: {
        title: 'Kontakt klein (nur E-Mail)',
        desc: 'Kontakt klein nur mit Telefon',
      },
      props: {
        contactSubtitle: 'Kantonale Heilmittelstelle des Kantons Zürich',
        contactEntry: {
          entryMail: {
            address: 'velo@vd.zh.ch',
            additionalInfo: 'Ihre Anfrage wird innerhalb der nächsten 3 Werktage bearbeitet.',
          },
        },
      },
    },
    fullWidth: {
      meta: {
        title: 'Kontakt volle Breite',
        desc: 'Kontakt unter Verwendung des gesamten Platzes',
      },
      props: {
        fullWidth: true,
        contactTitle: 'Kontakt',
        contactEntry: {
          entryHeading: {
            title: 'Koordinationsstelle Veloverkehr',
            level: 3,
            href: '#',
          },
          entryAddress: demoAddressDataFullWidth,
          entryPhone: demoPhoneDataFullWidth,
          entryMail: {
            address: 'velo@vd.zh.ch',
            additionalInfo: 'Ihre Anfrage wird innerhalb der nächsten 3 Werktage bearbeitet.',
          },
        },
      },
    },
    fullWidthLessData: {
      meta: {
        title: 'Kontakt volle Breite (Nur Titel)',
        desc: 'Kontakt unter Verwendung des gesamten Platzes - reduzierte Informationen',
      },
      props: {
        fullWidth: true,
        contactTitle: 'Kontakt',
        contactEntry: contactEntryData.variants.fullWidthLessData.props,
      },
    },
    biometrieAppointment: {
      meta: {
        title: 'Migrationsamt',
        desc: 'Für Biometrie-Terminvereinbarung',
      },
      props: {
        fullWidth: true,
        contactTitle: 'Ort',
        contactEntry: contactEntryData.variants.biometrieAppointment.props,
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
