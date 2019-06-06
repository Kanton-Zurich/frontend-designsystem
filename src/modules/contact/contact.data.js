const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('contact.hbs');

const demoAddressTimesData = [
  {
    openingTitle: 'Bürozeiten',
    times: [
      {
        text: 'Mo-Fr:',
        spaceSymbol: '-',
        timeFrom: '8.00',
        maschineTimeFrom: '08:00',
        timeTo: '11.30',
        maschineTimeTo: '11:30',
      },
      {
        text: ' & ',
        spaceSymbol: '-',
        timeFrom: '13.30',
        maschineTimeFrom: '13:30',
        timeTo: '17.00',
        maschineTimeTo: '17:00',
      },
    ],
  },
  {
    openingTitle: 'Schalter',
    times: [
      {
        text: 'Mo - Mi:',
        spaceSymbol: '-',
        timeFrom: '13.30',
        maschineTimeFrom: '12:30',
        timeTo: '17.30',
        maschineTimeTo: '17:30',
        insertLineBreak: true,
      },
      {
        text: ' Do: ',
        spaceSymbol: '-',
        timeFrom: '13:30',
        maschineTimeFrom: '13:30',
        timeTo: '19.00',
        maschineTimeTo: '19:00',
      },
    ],
  },
];

const demoAddressTimesDataFullWidth = [
  {
    openingTitle: 'Bürozeiten',
    times: [
      {
        text: 'Mo-Fr:',
        spaceSymbol: '-',
        timeFrom: '8.00',
        maschineTimeFrom: '08:00',
        timeTo: '11.30',
        maschineTimeTo: '11:30',
      },
      {
        text: ' & ',
        spaceSymbol: '-',
        timeFrom: '13.30',
        maschineTimeFrom: '13:30',
        timeTo: '17.00',
        maschineTimeTo: '17:00',
      },
    ],
  },
  {
    openingTitle: 'Schalter',
    times: [
      {
        text: 'Mo - Mi:',
        spaceSymbol: '-',
        timeFrom: '13.30',
        maschineTimeFrom: '12:30',
        timeTo: '17.30',
        maschineTimeTo: '17:30',
        insertLineBreak: true,
      },
    ],
  },
  {
    times: [
      {
        text: ' Do: ',
        spaceSymbol: '-',
        timeFrom: '13:30',
        maschineTimeFrom: '13:30',
        timeTo: '19.00',
        maschineTimeTo: '19:00',
      },
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
  openingTimes: demoAddressTimesData,
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

const demoPhoneTimesData = [
  {
    text: 'Mo-Mi: ',
    spaceSymbol: '-',
    timeFrom: '13.30',
    maschineTimeFrom: '13:30',
    timeTo: '17.30',
    maschineTimeTo: '17:30',
    insertLineBreak: true,
  },
  {
    text: 'Do: ',
    spaceSymbol: '-',
    timeFrom: '13.30',
    maschineTimeFrom: '13:30',
    timeTo: '19.00',
    maschineTimeTo: '19:00',
    insertLineBreak: true,
  },
  {
    text: 'Fr: ',
    spaceSymbol: '-',
    timeFrom: '13.30',
    maschineTimeFrom: '13:30',
    timeTo: '17.30',
    maschineTimeTo: '17:30',
    insertLineBreak: true,
  },

];

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

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Kontakt',
    className: 'Contact',
    jira: 'CZHDEV-257',
    documentation: dataHelper.getDocumentation('contact.md'),
  },
  props: {

  },
});
const variants = _.mapValues({
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
  fullWidthLessData2: {
    meta: {
      title: 'Kontakt volle Breite (Nur Titel mit Karte(TODO))',
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
