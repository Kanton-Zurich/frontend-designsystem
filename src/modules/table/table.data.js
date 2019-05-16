const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const defFigcaptionData = require('../../atoms/figcaption/figcaption.data').variants.default;

const template = dataHelper.getFileContent('table.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Tabelle',
    className: 'Table',
    jira: 'CZHDEV-121',
    documentation: dataHelper.getDocumentation('table.md'),
  },
  props: {
    tableTitle: 'Der Kanton in Zahlen',
    tableSubtitle: '2007–2017',
    headers: [
      {
        title: '<span class="visuallyhidden">Bezirk</span>',
        isSortable: false,
      }, {
        title: 'Einwohnerzahl<sup>1</sup> <span class="visuallyhidden">Nach zivilrechtlichem Wohnsitzbegriff, Daten per Ende Jahr</span> 2017',
        isSortable: false,
      }, {
        title: 'Bevölkerungswachstum<br> 2007–2017 in %',
        isSortable: false,
      }, {
        title: 'Beschäftigte 2015',
        isSortable: false,
      },
    ],
    bodyrows: [
      {
        data: ['<a href="#" class="atm-text_link">Kanton Zürich</a>', '1498643', '15,2', '1005751'],
        isHighlighted: true,
      }, {
        data: ['Affoltern<sup>2</sup> <span class="visuallyhidden">Stand 2016</span>', '53531', '18,4', '17171'],
      }, {
        data: ['Andelfingen', '31140', '9,6', '11094'],
      }, {
        data: ['Bülach', '148897', '21,3', '110370'],
      }, {
        data: ['Dielsdorf', '89221', '19,1', '38164'],
      },
    ],
    caption: _.merge({}, defFigcaptionData, {
      caption: '<sup>1</sup> Nach zivilrechtlichem Wohnsitzbegriff, Daten per Ende Jahr<br><sup>2</sup> Stand 2016',
    }),
    hasTitle: true,
    tableHeadingLevel: 2,
    hasSubtitle: true,
    hasColumnHeader: true,
    hasRowHeader: false,
    hasCaption: true,
    alignRight: false,
    colorVariation: false,
    isFirstColumnFixed: false,
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Standard',
      desc: 'Standard-Tabelle',
    },
  },
  alignRight: {
    meta: {
      title: 'Rechtsbündig',
      desc: 'Variante mit rechtsbündig ausgerichteten Datenzellen',
    },
    props: {
      alignRight: true,
    },
  },
  isInverted: {
    meta: {
      title: 'Invertiert',
      desc: 'Invertierte Variante',
    },
    props: {
      isInverted: true,
    },
  },
  noTitle: {
    meta: {
      title: 'Ohne Titel',
      desc: 'Variante ohne Titel',
    },
    props: {
      hasTitle: false,
    },
  },
  withLinks: {
    meta: {
      title: 'Mit Links',
      desc: 'Variante mit Links, Titel als H3',
    },
    props: {
      tableTitle: 'H3: 28px Black title Kontrollpunkt für mobile Geräte eingerichtet – den ersten in der Schweiz.',
      tableHeadingLevel: 3,
      hasSubtitle: false,
      hasCaption: false,
      headers: [
        {
          title: 'Daten/Publikation',
          isSortable: false,
        }, {
          title: 'Termin',
          isSortable: false,
        },
      ],
      bodyrows: [
        {
          data: ['<a href="#" class="atm-text_link">Gemeindesteuerfüsse 2019</a>', 'Januar bis März'],
        },
        {
          data: ['<a href="#" class="atm-text_link">Kantonale Bevölkerungsstatistik 2018 (prov.)</a>', '08. Februar'],
        },
        {
          data: ['<a href="#" class="atm-text_link">Abstimmungsanalyse Februar</a>', 'Ende Februar'],
        },
        {
          data: ['<a href="#" class="atm-text_link">Ausländerstatistik 2018</a>', 'März'],
        },
      ],
    },
  },
  withRowHeader: {
    meta: {
      title: 'Mit Reihenüberschriften',
      desc: 'Variante mit Reihenüberschriften, Titel als H4',
    },
    props: {
      tableTitle: 'Demografische Altersmasszahlen nach Gebiet 2016',
      tableHeadingLevel: 4,
      hasSubtitle: false,
      hasRowHeader: true,
      alignRight: true,
      headers: [
        {
          title: '<span class="visuallyhidden">Alterssegment</span>',
          isSortable: false,
        }, {
          title: 'Kanton Zürich',
          isSortable: false,
        }, {
          title: 'Stadt Zürich',
          isSortable: false,
        }, {
          title: 'Übriger Kanton ZH',
          isSortable: false,
        }, {
          title: 'Schweiz',
          isSortable: false,
        }, {
          title: 'Schweiz ohne<br>Kanton ZH',
          isSortable: false,
        },
      ],
      bodyrows: [
        {
          data: ['0–19 Jahre', '293', '68', '225', '1691', '1398'],
        }, {
          data: ['20–39 Jahre', '293', '68', '225', '1691', '1398'],
        }, {
          data: ['40–64 Jahre', '293', '68', '225', '1691', '1398'],
        }, {
          data: ['65–79 Jahre', '293', '68', '225', '1691', '1398'],
        },
      ],
    },
  },
  firstColumnFixed: {
    meta: {
      title: 'Mit fixierter erster Spalte',
      desc: 'Erste Spalte fixiert, horizontal scrollbar',
    },
    props: {
      tableTitle: 'Vergleich Life Sciences-Sektor Zürich mit ausgewählten Kantonen/Regionen',
      tableHeadingLevel: 3,
      hasSubtitle: false,
      hasCaption: true,
      isFirstColumnFixed: true,
      hasRowHeader: true,
      alignRight: true,
      headers: [
        {
          title: '<span class="visuallyhidden">Region</span>',
          isSortable: false,
        }, {
          title: 'Arbeitsstätten',
          isSortable: false,
        }, {
          title: 'Anteil an der Gesamtwirtschaft',
          isSortable: false,
        }, {
          title: 'Anteil an der Gesamtschweiz',
          isSortable: false,
        }, {
          title: 'Beschäftigte Vollzeit',
          isSortable: false,
        }, {
          title: 'Beschäftigte Teilzeit',
          isSortable: false,
        }, {
          title: 'Gesamtumsatz* in Mio. CHF',
          isSortable: false,
        }, {
          title: 'Bruttowertschöpfung** in Mio. CHF',
          isSortable: false,
        },
      ],
      bodyrows: [
        {
          data: ['Zürich', '293', '4,5%', '68%', '1691', '1398', '487', '287'],
        }, {
          data: ['Bern', '293', '4,5%', '68%', '1691', '1398', '487', '287'],
        }, {
          data: ['Basel', '293', '4,5%', '68%', '1691', '1398', '487', '287'],
        }, {
          data: ['Gesamtschweiz', '293', '4,5%', '68%', '1691', '1398', '487', '287'],
          isHighlighted: true,
        },
      ],
      caption: {
        caption: 'Quelle: BZ 2008, BFS; eigene Berechnungen Statistisches Amt des Kantons Zürich',
      },
    },
  },
  wideFirstColumnFixed: {
    meta: {
      title: 'Volle Breite mit fixierter erster Spalte',
      desc: 'Erste Spalte fixiert, horizontal scrollbar, auf volle Inhaltsbreite',
    },
    props: {
      tableTitle: 'Vergleich Life Sciences-Sektor Zürich mit ausgewählten Kantonen/Regionen',
      tableHeadingLevel: 3,
      hasSubtitle: false,
      hasCaption: true,
      isWide: true,
      isFirstColumnFixed: true,
      hasRowHeader: true,
      alignRight: true,
      headers: [
        {
          title: '<span class="visuallyhidden">Region</span>',
          isSortable: false,
        }, {
          title: 'Arbeitsstätten',
          isSortable: false,
        }, {
          title: 'Anteil an der Gesamtwirtschaft',
          isSortable: false,
        }, {
          title: 'Anteil an der Gesamtschweiz',
          isSortable: false,
        }, {
          title: 'Beschäftigte Vollzeit',
          isSortable: false,
        }, {
          title: 'Beschäftigte Teilzeit',
          isSortable: false,
        }, {
          title: 'Beschäftigte Vollzeit Vorjahr',
          isSortable: false,
        }, {
          title: 'Beschäftigte Teilzeit Vorjahr',
          isSortable: false,
        }, {
          title: 'Gesamtumsatz* in Mio. CHF',
          isSortable: false,
        }, {
          title: 'Bruttowertschöpfung** in Mio. CHF',
          isSortable: false,
        },
      ],
      bodyrows: [
        {
          data: ['Zürich', '293', '4,5%', '68%', '1691', '1398', '1691', '1398', '487', '287'],
        }, {
          data: ['Bern', '293', '4,5%', '68%', '1691', '1398', '1691', '1398', '487', '287'],
        }, {
          data: ['Basel', '293', '4,5%', '68%', '1691', '1398', '1691', '1398', '487', '287'],
        }, {
          data: ['Gesamtschweiz', '293', '4,5%', '68%', '1691', '1398', '1691', '1398', '487', '287'],
          isHighlighted: true,
        },
      ],
      caption: {
        caption: 'Quelle: BZ 2008, BFS; eigene Berechnungen Statistisches Amt des Kantons Zürich',
      },
    },
  },
  blue: {
    meta: {
      title: 'Blau ZH',
      desc: '',
    },
    props: {
      colorVariation: 'blue',
    },
  },
  darkblue: {
    meta: {
      title: 'Dunkelblau ZH',
      desc: '',
    },
    props: {
      colorVariation: 'darkblue',
    },
  },
  turqoise: {
    meta: {
      title: 'Türkis ZH',
      desc: '',
    },
    props: {
      colorVariation: 'turqoise',
    },
  },
  green: {
    meta: {
      title: 'Grün ZH',
      desc: '',
    },
    props: {
      colorVariation: 'green',
    },
  },
  bordeaux: {
    meta: {
      title: 'Bordeaux ZH',
      desc: '',
    },
    props: {
      colorVariation: 'bordeaux',
    },
  },
  magenta: {
    meta: {
      title: 'Magenta ZH',
      desc: '',
    },
    props: {
      colorVariation: 'magenta',
    },
  },
  violet: {
    meta: {
      title: 'Violett ZH',
      desc: '',
    },
    props: {
      colorVariation: 'violet',
    },
  },
  sortable: {
    meta: {
      title: 'Standard mit sortierbaren Spalten',
      desc: 'Ausgewählte Spalten können sortiert werden.',
    },
    props: {
      tableTitle: 'Beliebteste Filme im Kanton',
      tableSubtitle: '1995-2007',
      headers: [
        {
          title: 'Rang',
          isSortable: 'enum',
        },
        {
          title: 'Filmtitel',
          isSortable: false,
        },
        {
          title: 'Herkunft',
          isSortable: 'alpha',
        },
        {
          title: 'Besucher/-innen',
          isSortable: 'enum',
        },
      ],
      bodyrows: [
        {
          data: ['1', 'Titanic', 'USA', '296521'],
        },
        {
          data: ['2', 'Finding Nemo', 'USA', '207095'],
        },
        {
          data: ['3', 'Casino Royale (James Bond) Remake 2006', 'UK/USA', '200026'],
        },
        {
          data: ['4', 'Ice Age 2', 'USA', '187757'],
        },
      ],
      caption: _.merge({}, defFigcaptionData, {
        caption: 'Quelle: Pro Cinema',
      }),
    },
  },
  firstColumnFixedSortable: {
    meta: {
      title: 'Mit fixierter erster Spalte und sortierbaren Spalten',
      desc: 'Erste Spalte fixiert, horizontal scrollbar',
    },
    props: {
      tableTitle: 'Vergleich Life Sciences-Sektor Zürich mit ausgewählten Kantonen/Regionen',
      tableHeadingLevel: 3,
      hasSubtitle: false,
      hasCaption: true,
      isFirstColumnFixed: true,
      hasRowHeader: true,
      alignRight: true,
      headers: [
        {
          title: '<span class="visuallyhidden">Region</span>',
          isSortable: 'alpha',
        }, {
          title: 'Arbeitsstätten',
          isSortable: false,
        }, {
          title: 'Anteil an der Gesamtwirtschaft',
          isSortable: 'enum',
        }, {
          title: 'Anteil an der Gesamtschweiz',
          isSortable: 'enum',
        }, {
          title: 'Beschäftigte Vollzeit',
          isSortable: 'enum',
        }, {
          title: 'Beschäftigte Teilzeit',
          isSortable: 'enum',
        }, {
          title: 'Gesamtumsatz* in Mio. CHF',
          isSortable: 'enum',
        }, {
          title: 'Bruttowertschöpfung** in Mio. CHF',
          isSortable: 'enum',
        },
      ],
      bodyrows: [
        {
          data: ['Zürich', '293', '3%', '68%', '1691', '1398', '487', '287'],
        }, {
          data: ['Bern', '293', '4%', '68%', '1691', '1398', '487', '287'],
        }, {
          data: ['Basel', '293', '4,5%', '68%', '1691', '1398', '487', '287'],
        }, {
          data: ['Gesamtschweiz', '293', '5%', '68%', '1691', '1398', '487', '287'],
          isHighlighted: true,
        },
      ],
      caption: {
        caption: 'Quelle: BZ 2008, BFS; eigene Berechnungen Statistisches Amt des Kantons Zürich',
      },
    },
  },
}, (variant) => {
  // eslint-disable-next-line consistent-return
  const variantProps = _.mergeWith({}, data, variant, (dataValue, variantValue, key) => {
    if ((key === 'bodyrows') || (key === 'headers')) {
      return variantValue;
    }
  }).props;

  const compiledVariant = () => handlebars.compile(template)(variantProps);
  const variantData = _.mergeWith({}, data, variant, {
    meta: {
      demo: compiledVariant,

      code: {
        handlebars: dataHelper.getFormattedHandlebars(template),
        html: dataHelper.getFormattedHtml(compiledVariant()),
        data: dataHelper.getFormattedJson(variantProps),
      },
    },
  // eslint-disable-next-line consistent-return
  }, (dataValue, variantValue, key) => {
    if ((key === 'bodyrows') || (key === 'headers')) {
      return variantValue;
    }
  });

  return variantData;
});

data.variants = variants;

module.exports = data;
