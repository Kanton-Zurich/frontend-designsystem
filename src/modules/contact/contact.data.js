const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const mapViewDefaultData = require('../../modules/map_view/map_view.data').variants.default.props;
const socialMediaLinksContactData = require('../../modules/social_media_links/social_media_links.data').variants.contactVariant.props;

const template = dataHelper.getFileContent('contact.hbs');

const demoAddressTextsDataFullWidth = [
  {
    title: 'Postfach',
    texts: [
      'Postfach<br>8080 Zürich',
    ],
  },
  {
    title: 'Schalter',
    texts: [
      'Mo - Mi: 13.30 - 17.30<br>Do: 13:30 - 19:00<br>Fr: 13:30 - 17:30',
    ],
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

const demoPhoneData = [
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
  },
];
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

const locationDemoData = {
  adress: {
    street: 'Riedthofstrasse 192',
    zip: '8105',
    city: 'Regensdorf 1',
    routeLinkHref: '#',
    routeLinkLabel: 'Route anzeigen',
    copytoclipboardButton: _.merge({}, demoCopyButton, { link: true }),
    additionalInfo: 'Wir befinden uns im 2.Obergeschoss',
    additionalTexts: demoAddressTextsDataFullWidth,
  },
  phone: [
    {
      anchorLabel: '058 811 50 00',
      phoneNumer: '+41588113000',
      additionalInfo: 'Telefon',
      openingTimes: [{
        times: [
          { text: 'Von 12.00 bis 13.00 Uhr können über die Telefonzentrale keine Anrufe entgegen genommen werden.' },
        ],
      }],
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
    title: 'Kontakt',
    className: 'Contact',
    jira: 'CZHDEV-257',
    label: 'Komplex',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    contactAriaTitle_location: 'Adresse',
    contactAriaTitle_phone: 'Telefon',
    contactAriaTitle_email: 'E-Mail',
  },
});

const variants = _.mapValues({
  revampedStandart: {
    meta: {
      title: 'CZHDEV-2963 (Variante Standart)',
      desc: 'Kontakt mit Service Link und Adresse-Kopierfunktion',
    },
    props: {
      fullWidth: true,
      contactTitle: 'Kontakt',
      contactSubtitle: 'Koordinationsstelle Veloverkehr',
      contactSubtitleMoreInfo: {
        href: '#',
        label: 'Mehr erfahren',
        icon: true,
      },
      contactAddress: {
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
      contactPhone: [{
        anchorLabel: '058 811 30 00',
        phoneNumer: '+41588113000',
        additionalInfo: 'Kostenlos',
      }],
      contactMail: {
        address: 'passbuerozürich@ds.zh.ch',
        additionalInfo: 'Bitte keine Gesuche über diese Email einreichen',
        additionalService: {
          label: 'Ausweisanträge können nur am Schalter entgegengenommen werden',
          linkLabel: 'Kontaktformular',
          linkHref: '#',
        },
      },
    },
  },
  revampedMedia: {
    meta: {
      title: 'CZHDEV-2963 (Variante Medienkontakt)',
      desc: 'Kontakt mit Medienkontakt, Social-Media Buttons und ohne Karte',
    },
    props: {
      fullWidth: true,
      contactTitle: 'Kontakt',
      contactSubtitle: 'Koordinationsstelle Veloverkehr',
      contactInfoText: 'Bitte keine Gesuche über diese Email einreichen',
      contactSubtitleMoreInfo: {
        href: '#',
        label: 'Mehr erfahren',
        icon: true,
      },
      contactAddress: {
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
      contactPhone: [{
        anchorLabel: '058 811 30 00',
        phoneNumer: '+41588113000',
        additionalInfo: 'Kostenlos',
      }],
      contactMail: {
        address: 'passbuerozürich@ds.zh.ch',
        additionalInfo: 'Bitte keine Gesuche über diese Email einreichen',
      },
      mediaContact: {
        seperatorTop: true,
        title: 'Medienkontakt',
        openLabel: 'Medienkontakt',
        lead: 'Kommunikationsbeauftragter der Finanzdirektion',
        email: 'media@dz.zh.ch',
        additionals: 'Nur für Medienanliegen, andere Anfregen werden weitergeleitet',
      },
      socialMediaLinks: socialMediaLinksContactData,
    },
  },
  revampedMap: {
    meta: {
      title: 'CZHDEV-2963 (Variante Karte)',
      desc: 'Kontakt mit Medienkontakt und Karte',
    },
    props: {
      fullWidth: true,
      contactTitle: 'Kontakt',
      contactSubtitle: 'Koordinationsstelle Veloverkehr',
      contactSubtitleMoreInfo: {
        href: '#',
        label: 'Mehr erfahren',
        icon: true,
      },
      contactAddress: {
        street: 'Uetlibergstrasse 301',
        zip: '8036',
        name: 'Zürich-Albisgütli',
        city: 'Zürich',
        copytoclipboardButton: demoCopyButton,
      },
      withModuleLogic: true,
      contactPhone: [{
        anchorLabel: '058 811 30 00',
        phoneNumer: '+41588113000',
        additionalInfo: 'Kostenlos',
      }],
      contactMail: {
        address: 'passbuerozürich@ds.zh.ch',
      },
      mediaContact: {
        seperatorTop: true,
        title: 'Medienkontakt',
        openLabel: 'Medienkontakt',
        lead: 'Kommunikationsbeauftragter der Finanzdirektion',
        email: 'media@dz.zh.ch',
        additionals: 'Nur für Medienanliegen, andere Anfregen werden weitergeleitet',
      },
      mapData: _.merge({}, mapViewDefaultData, {
        mapId: 'contact-map',
        withUserLocate: false,
        mapMarker: [
          { lat: 47.380467, lng: 8.548396 },
        ],
        directions: {
          enabled: true,
        },
      }),
    },
  },
  revampedSocialMedia: {
    meta: {
      title: 'CZHDEV-2963 (Variante Social-Media)',
      desc: 'Kontakt mit Social-Media Buttons',
    },
    props: {
      fullWidth: true,
      withModuleLogic: true,
      contactTitle: 'Kontakt',
      contactSubtitle: 'Koordinationsstelle Veloverkehr',
      contactSubtitleMoreInfo: {
        href: '#',
        label: 'Mehr erfahren',
        icon: true,
      },
      contactAddress: {
        street: 'Uetlibergstrasse 301',
        zip: '8036',
        name: 'Zürich-Albisgütli',
        city: 'Zürich',
        routeLinkHref: '#',
        routeLinkLabel: 'Route anzeigen',
      },
      contactPhone: [{
        anchorLabel: '058 811 30 00',
        phoneNumer: '+41588113000',
        additionalInfo: 'Kostenlos',
      }],
      contactMail: {
        address: 'passbuerozürich@ds.zh.ch',
      },
      socialMediaLinks: socialMediaLinksContactData,
    },
  },
  revampedService: {
    meta: {
      title: 'CZHDEV-2963 (Variante Service)',
      desc: 'Kontakt klein nur mit Adresse-Kopierfunktion',
    },
    props: {
      contactSubtitle: 'Koordinationsstelle Veloverkehr',
      contactAddress: {
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
  fullWidthLessData2: {
    meta: {
      title: 'Kontakt volle Breite (mit Karte)',
      desc: 'Kontakt unter Verwendung des gesamten Platzes - reduzierte Informationen',
    },
    props: {
      fullWidth: true,
      contactTitle: 'Kontakt',
      contactSubtitle: 'Kantonale Heilmittelstellte des Kantons Zürich',
      contactSubtitleMoreInfo: {
        href: '#',
        label: 'Mehr erfahren',
        icon: true,
      },
      contactAddress: {
        name: 'Regionale Fachstelle der Ost- und Zentralschweiz ',
        street: 'Haldenbachstrasse 12',
        zip: 'CH-8006',
        city: 'Zürich',
      },
      contactPhone: [
        {
          anchorLabel: '058 811 30 00',
          phoneNumer: '+41588113000',
          additionalInfo: 'Allgemeine Fragen',
        },
        {
          anchorLabel: '058 811 30 20',
          phoneNumer: '+41588113020',
          additionalInfo: 'Notfall-Nummer',
        },
      ],
      contactMail: {
        address: 'heilmittelkontrolle@khz.zh.ch',
      },
      mapData: _.merge({}, mapViewDefaultData, {
        mapId: 'contact-map',
        withUserLocate: false,
        mapMarker: [
          { lat: 47.380467, lng: 8.548396 },
        ],
        directions: {
          enabled: true,
        },
      }),
    },
  },
  default: {
    meta: {
      title: 'Kontakt klein (nur Adresse)',
      desc: 'Kontakt klein nur mit Adresse',
    },
    props: {
      contactSubtitle: 'Kantonale Heilmittelstellte des Kantons Zürich',
      contactAddress: demoAddressData,
    },
  },
  smallMailOnly: {
    meta: {
      title: 'Kontakt klein (nur E-Mail)',
      desc: 'Kontakt klein nur mit Telefon',
    },
    props: {
      contactSubtitle: 'Kantonale Heilmittelstellte des Kantons Zürich',
      contactMail: {
        address: 'velo@vd.zh.ch',
        additionalInfo: 'Ihre Anfrage wird innerhalb der nächsten 3 Werktage bearbeitet.',
      },
    },
  },
  defaultSmallLead: {
    meta: {
      title: 'Kontakt klein (mit Untertitel)',
      desc: 'Kontakt klein',
    },
    props: {
      contactSubtitle: 'Kantonale Heilmittelstellte des Kantons Zürich',
      contactAddress: demoAddressData,
      contactLead: 'Hallo ich bin ein Untertitel',
      contactSubtitleMoreInfo: {
        href: '#',
        label: 'Mehr erfahren',
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
      contactSubtitle: 'Koordinationsstelle Veloverkehr',
      contactAddress: demoAddressDataFullWidth,
      contactPhone: demoPhoneDataFullWidth,
      contactSubtitleMoreInfo: {
        href: '#',
        label: 'Mehr erfahren',
      },
      contactMail: {
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
      fullWidth: true,
      contactTitle: 'Kontakt',
      contactSubtitle: 'Koordinationsstelle Veloverkehr',
      contactSubtitleMoreInfo: {
        href: '#',
        label: 'Mehr erfahren',
      },
      contactAddress: {
        name: 'Zürich-Albisgütli',
        street: 'Uetlibergstrasse 301',
        zip: '8036',
        city: 'Zürich',
        routeLinkHref: '#',
        routeLinkLabel: 'Route anzeigen',
      },
      contactPhone: [
        {
          anchorLabel: '058 811 30 00',
          phoneNumer: '+41588113000',
          additionalInfo: 'Telefon',
        },
      ],
      contactMail: {
        address: 'velo@vd.zh.ch',
      },
    },
  },
  location: {
    meta: {
      title: 'Standort -Kontakt',
      desc: 'Darstellung wie verwendet in Standorte (module locations)',
    },
    props: {
      inLocation: true,
      contactSubtitle: 'Strassenverkehrsamt Regensdorf',
      contactSubtitleLink: '#',
      contactAddress: locationDemoData.adress,
      contactPhone: locationDemoData.phone,
      contactSubtitleMoreInfo: {
        href: '#',
        label: 'Mehr erfahren',
      },
      contactMail: {
        address: 'info@stva.zh.ch',
        additionalInfo: 'Ihre Anfrage wird innerhalb der nächsten 3 Werktage bearbeitet.',
      },
    },
  },
  withLead: {
    meta: {
      title: 'Kontakt mit Titel, Subtitel, Lead und Karte',
      desc: 'Darstellung eines Kontakts mit Titel, Subtitel, Lead und Karte',
    },
    props: {
      fullWidth: true,
      contactTitle: 'Kontakt',
      contactSubtitle: 'Amt für Abfall, Wasser, Energie und Luft',
      contactLead: 'Abteilung Gewässerschutz, Sektion Abwasserreinigungsanlagen',
      contactSubtitleMoreInfo: {
        href: '#',
        label: 'Mehr erfahren',
      },
      contactAddress: {
        street: 'Walcheplatz 2',
        zip: '8090',
        city: 'Zürich',
      },
      contactPhone: [{
        anchorLabel: '+41 43 258 61 00',
        phoneNumer: '+41432586100',
        additionalInfo: 'Allgemeint Fragen',
      }],
      contactMail: {
        address: 'awel@bd.zh.ch',
      },
      mapData: _.merge({}, mapViewDefaultData, {
        mapId: 'contact-map',
        withUserLocate: false,
        mapMarker: [
          { lat: 47.380467, lng: 8.548396 },
        ],
        directions: {
          enabled: true,
        },
      }),
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
