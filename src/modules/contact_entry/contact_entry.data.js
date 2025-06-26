const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const socialMediaLinksContactData = require('../social_media_links/social_media_links.data')
  .variants.contactVariant.props;

const template = dataHelper.getFileContent('contact_entry.hbs');

const demoAddressTextsDataFullWidth = [
  {
    title: 'Postfach',
    texts: [
      'Postfach<br>8080 Zürich<br><p><u>Liste (unterstrichen)</u></p><ul><li>Bulletpoint 1</li><li>Bulletpoint 2</li></ul><p><u>Aufzählung (unterstrichen)</u></p><ol><li>Liste 1</li><li>Liste 2</li></ol>',
    ],
  },
  {
    title: 'Schalter',
    texts: ['Mo - Mi: 13.30 - 17.30<br>Do: 13:30 - 19:00<br>Fr: 13:30 - 17:30'],
    link: {
      text: 'Andere Kontakte',
    },
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
    additionalInfoSpaced: 'Montag - Freitag 08:00 - 12:00 und 13:00 - 16:30Uhr',
  },
  {
    anchorLabel: '058 811 30 20',
    phoneNumer: '+41588113020',
    additionalInfo: 'Notfall-Nummer',
    additionalInfoSpaced: 'Nur Wochenends von Januar bis Mai',
  },
];

const locationDemoData = {
  adress: {
    street: 'Riedthofstrasse 192',
    zip: '8105',
    city: 'Regensdorf 1',
    routeLinkHref: '#',
    routeLinkLabel: 'Route anzeigen',
    copytoclipboardButton: demoCopyButton,
    additionalInfo: 'Wir befinden uns im 2.Obergeschoss',
    additionalTexts: demoAddressTextsDataFullWidth,
  },
  phone: [
    {
      anchorLabel: '058 811 50 00',
      phoneNumer: '+41588113000',
      additionalInfo: 'Telefon',
      additionalInfoSpaced: 'Montag - Freitag 08:00 - 12:00 und 13:00 - 16:30Uhr',
    },
    {
      anchorLabel: '058 811 50 01',
      phoneNumer: '+41588113020',
      additionalInfo: 'Fax',
    },
  ],
};

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Kontakteintrag',
    className: 'ContactEntry',
    jira: 'CZHDEV-3295',
    label: 'Komplex',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    entryAriaTitle_location: 'Adresse',
    entryAriaTitle_phone: 'Telefon',
    entryAriaTitle_email: 'E-Mail',
  },
});

const variants = _.mapValues(
  {
    revampedStandard: {
      meta: {
        title: 'CZHDEV-3295 (Variante Standard)',
        desc: 'Kontakteintrag mit Service Link und Adresse-Kopierfunktion',
      },
      props: {
        entryHeading: {
          title: 'Koordinationsstelle Veloverkehr',
          level: 3,
          href: '#',
        },
        entryInfoText:
          'Optionaler Bemerkungstext. Bei allgemeinen Fragen zu dem oben aufgeführten Thema, könne Sie sich hier melden.',
        entryAddress: {
          street: 'Uetlibergstrasse 301',
          zip: '8036',
          name: 'Zürich-Albisgütli',
          city: 'Zürich',
          copytoclipboardButton: demoCopyButton,
          routeLinkHref: '#',
          routeLinkLabel: 'Route anzeigen',
          additionalTexts: demoAddressTextsDataFullWidth,
        },
        withModuleLogic: true,
        entryPhone: [
          {
            anchorLabel: '058 811 30 00',
            phoneNumer: '+41588113000',
            additionalInfo: 'Kostenlos',
            additionalInfoSpaced: 'Montag - Freitag 08:00 - 12:00 und 13:00 - 16:30Uhr',
          },
        ],
        entryMail: {
          address:
            'eine.lange.email-adressse@koordinationsstelle-fuer-lange-amtsstellennamen.zh.ch',
          additionalInfo: 'Bitte keine Gesuche über diese Email einreichen',
          additionalService: {
            label: 'Ausweisanträge können nur am Schalter entgegengenommen werden',
            linkLabel: 'Kontaktformular',
            linkHref: '#',
          },
        },
        socialMediaLinks: socialMediaLinksContactData,
      },
    },
    revampedMedia: {
      meta: {
        title: 'CZHDEV-2963 (Variante Medienkontakt)',
        desc: 'Kontakt mit Medienkontakt, Social-Media Buttons und ohne Karte',
      },
      props: {
        entryHeading: {
          title: 'Kommunikationsbeauftragter der Finanzdirektion',
          level: 4,
        },
        entryPhone: [
          {
            anchorLabel: '058 811 30 00',
            phoneNumer: '+41588113000',
          },
        ],
        entryMail: {
          address: 'media@dz.zh.ch',
          additionalInfo: 'Nur für Medienanliegen, andere Anfregen werden weitergeleitet',
        },
      },
    },
    revampedService: {
      meta: {
        title: 'CZHDEV-2963 (Variante Service)',
        desc: 'Kontakt klein nur mit Adresse-Kopierfunktion',
      },
      props: {
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
    default: {
      meta: {
        title: 'Kontakt klein (nur Adresse)',
        desc: 'Kontakt klein nur mit Adresse',
      },
      props: {
        entryHeading: {
          title: 'Kantonale Heilmittelstelle des Kantons Zürich',
          level: 3,
        },
        entryAddress: demoAddressData,
      },
    },
    smallMailOnly: {
      meta: {
        title: 'Kontakt klein (nur E-Mail)',
        desc: 'Kontakt klein nur mit Telefon',
      },
      props: {
        entryHeading: {
          title: 'Kantonale Heilmittelstelle des Kantons Zürich',
          level: 3,
        },
        entryMail: {
          address: 'velo@vd.zh.ch',
          additionalInfo: 'Ihre Anfrage wird innerhalb der nächsten 3 Werktage bearbeitet.',
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
        entryTitle: 'Kontakt',
        entryAddress: demoAddressDataFullWidth,
        entryPhone: demoPhoneDataFullWidth,
        entryMail: {
          address: 'velo@vd.zh.ch',
          additionalInfo: 'Ihre Anfrage wird innerhalb der nächsten 3 Werktage bearbeitet.',
        },
      },
    },
    fullWidthLessData: {
      meta: {
        title: 'Kontakt volle Breite (Nur Titel)',
        desc: 'Kontakt unter Verwendung des gesamten Platzes - reduzierte Informationen',
      },
      props: {
        entryHeading: {
          title: 'Koordinationsstelle Veloverkehr',
          level: 3,
          href: '#',
        },
        entryAddress: {
          name: 'Zürich-Albisgütli',
          street: 'Uetlibergstrasse 301',
          zip: '8036',
          city: 'Zürich',
          routeLinkHref: '#',
          routeLinkLabel: 'Route anzeigen',
        },
        entryPhone: [
          {
            anchorLabel: '058 811 30 00',
            phoneNumer: '+41588113000',
            additionalInfo: 'Telefon',
          },
        ],
        entryMail: {
          address: 'velo@vd.zh.ch',
        },
      },
    },
    location: {
      meta: {
        title: 'Standort-Kontakt',
        desc: 'Darstellung wie verwendet in Standorte (module locations)',
      },
      props: {
        inLocation: true,
        entryHeading: {
          title: 'Strassenverkehrsamt Regensdorf',
          level: 4,
        },
        entryAddress: locationDemoData.adress,
        entryPhone: locationDemoData.phone,
        entryMail: {
          address: 'info@stva.zh.ch',
          additionalInfo: 'Ihre Anfrage wird innerhalb der nächsten 3 Werktage bearbeitet.',
        },
      },
    },
    contentFull: {
      meta: {
        title: 'Inhalts-Kontakt (Adresse, Telefon & E-Mail)',
        desc: 'Kontakt Inhalt',
      },
      props: {
        singleColumn: true,
        entryHeading: {
          title: 'Koordinationsstelle Veloverkehr',
          level: 3,
        },
        entryInfoText:
          'Optionaler Bemerkungstext. Bei allgemeinen Fragen zu dem oben aufgeführten Thema, könne Sie sich hier melden.',
        entryMail: {
          address: 'beispiel@email.com',
          additionalInfo: 'Bitte keine Gesuche über diese E-Mail einreichen',
        },
        entryPhone: [
          {
            anchorLabel: '058 811 30 00',
            phoneNumer: '+41588113000',
            additionalInfo: 'Kostenlos',
          },
        ],
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
    contentMedium: {
      meta: {
        title: 'Inhalts-Kontakt (Telefon & E-Mail)',
        desc: 'Kontakt Inhalt',
      },
      props: {
        singleColumn: true,
        entryHeading: {
          title: 'Koordinationsstelle Veloverkehr',
          level: 3,
          href: '#',
        },
        entryMail: {
          address: 'beispiel@email.com',
        },
        entryPhone: [
          {
            anchorLabel: '058 811 30 00',
            phoneNumer: '+41588113000',
          },
        ],
      },
    },
    contentSmall: {
      meta: {
        title: 'Inhalts-Kontakt (Telefon)',
        desc: 'Kontakt Inhalt',
      },
      props: {
        singleColumn: true,
        entryHeading: {
          title: 'Koordinationsstelle Veloverkehr',
          level: 3,
        },
        entryPhone: [
          {
            anchorLabel: '058 811 30 00',
            phoneNumer: '+41588113000',
          },
        ],
      },
    },
    biometrieAppointment: {
      meta: {
        title: 'Migrationsamt',
        desc: 'Für Biometrie-Terminvereinbarung',
      },
      props: {
        entryHeading: {
          title: 'Migrationsamt des Kantons Zürichs',
          level: 3,
          href: '#',
        },
        entryAddress: {
          street: 'Berninastrasse 45',
          zip: '8057',
          city: 'Zürich',
          additionalInfo: 'Schalter G-S (bitte beim Eingang rechts ziehen)',
        },
        entryPhone: [
          {
            anchorLabel: '+ 41 43 259 88 00',
            phoneNumer: '+ 41432598800',
            additionalInfo: 'Allgemeine Fragen',
            additionalInfoSpaced: 'Montag - Freitag 08:00 - 12:00 und 13:00 - 16:30Uhr',
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
