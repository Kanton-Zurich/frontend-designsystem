const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const mapViewDefaultData = require('../../modules/map_view/map_view.data').variants.default.props;

const template = dataHelper.getFileContent('contact.hbs');

const demoAddressTimesDataFullWidth = [
  {
    timeTitle: 'Bürozeiten',
    times: [
      { text: 'Mo-Fr: 8.00 - 11:30 &' },
      { text: '13:30 - 17:00' },
    ],
  },
  {
    timeTitle: 'Schalter',
    times: [
      { text: 'Mo - Mi: 12:30 - 17:30' },
      { text: 'Do: 13:30 - 19:00' },
    ],
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

const demoAddressData = {
  name: 'Zürich-Albisgütli',
  street: 'Uetlibergstrasse 301',
  zip: '8036',
  city: 'Zürich',
  routeLinkHref: '#',
  routeLinkLabel: 'Route anzeigen',
  additionalInfo: 'Wir befinden uns im 2.Obergeschoss',
  openingTimes: demoAddressTimesDataFullWidth,
};


const demoAddressDataFullWidth = {
  name: 'Zürich-Albisgütli',
  street: 'Uetlibergstrasse 301',
  zip: '8036',
  city: 'Zürich',
  routeLinkHref: '#',
  routeLinkLabel: 'Route anzeigen',
  additionalInfo: 'Wir befinden uns im 2.Obergeschoss',
  openingTimes: demoAddressTimesDataFullWidth,
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
    additionalInfo: 'Wir befinden uns im 2.Obergeschoss',
    openingTimes: [{
      timeTitle: 'Öffnungszeiten',
      times: [
        { text: 'Montag / Dienstag 07:15 - 17:00' },
        { text: 'Mittwoch - Freitag 07:15 - 16.00' },
      ],
    }],
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
    documentation: dataHelper.getDocumentation('contact.md'),
  },
  props: {
    contactAriaTitle_location: 'Adresse',
    contactAriaTitle_phone: 'Telefon',
    contactAriaTitle_email: 'E-Mail',
  },
});

const variants = _.mapValues({
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
  smallPhoneOnly: {
    meta: {
      title: 'Kontakt klein (nur Telefon)',
      desc: 'Kontakt klein nur mit Telefon',
    },
    props: {
      contactSubtitle: 'Kantonale Heilmittelstellte des Kantons Zürich',
      contactPhone: demoPhoneData,
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
      contactAddress: locationDemoData.adress,
      contactPhone: locationDemoData.phone,
      contactSubtitleMoreInfo: {
        href: '#',
        label: 'Seite anzeigen',
      },
      contactMail: {
        address: 'info@stva.zh.ch',
        additionalInfo: 'Ihre Anfrage wird innerhalb der nächsten 3 Werktage bearbeitet.',
      },
    },
  },
  mediaContractWidthMap: {
    meta: {
      title: 'Medienkontakt mit Karte',
      desc: 'Darstellung eines Kontakts mit Medienkontakt und Karte',
    },
    props: {
      fullWidth: true,
      contactTitle: 'Kontakt',
      contactAddress: {
        name: 'Kantonspolizei',
        street: 'Kasernenstrasse 29',
        zip: '8021',
        city: 'Zürich',
      },
      contactPhone: [
        {
          anchorLabel: '+41 44 247 22 11',
          phoneNumer: '+41442472211',
          additionalInfo: 'Telefon',
        },
      ],
      mediaContact: {
        title: 'Medienkontakt',
        lead: 'Mediendienst',
        email: 'info@kapo.zh.ch',
        phoneLabel: '058 811 30 00',
        phoneNumer: '+41588113000',
        address: 'Kasernenstrasse 29, Postfach, 8021 Zürich',
        additionals: 'Bürozeiten Mo bis Fr 08.00 bis 11.00 Uhr und 13.30 bis 16 Uhr',
      },
      mapData: _.merge({}, mapViewDefaultData, {
        mapId: 'contact-map-media',
        withUserLocate: false,
        mapMarker: [
          { lat: 47.380467, lng: 8.448396 },
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
