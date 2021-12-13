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
    label: 'Inhalt',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    tableTitle: 'Der Kanton in Zahlen',
    headers: [
      {
        title: '<span class="visuallyhidden">Bezirk</span>',
        isSortable: false,
      }, {
        title: 'Einwohnerzahl 2017',
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
        data: [{
          cellContent: '<a href="#" class="atm-text_link">Kanton Zürich</a>',
          isHighlighted: true,
        }, {
          cellContent: '1498643',
          isHighlighted: true,
        }, {
          cellContent: '15,2',
          isHighlighted: true,
        }, {
          cellContent: '1005751',
          isHighlighted: true,
        }],
      }, {
        data: ['Affoltern', '53531', '18,4', '17171'],
      }, {
        data: ['Andelfingen', '31140', '9,6', '11094'],
      }, {
        data: ['Bülach', '148897', '21,3', '110370'],
      }, {
        data: ['Dielsdorf', '89221', '19,1', '38164'],
      },
    ],
    hasTitle: true,
    tableHeadingLevel: 2,
    hasColumnHeader: true,
    hasRowHeader: false,
    hasCaption: false,
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
      title: 'Rechtsbündig, mit Tabellenunterschrift und Fussnoten',
      desc: 'Variante mit rechtsbündig ausgerichteten Datenzellen',
    },
    props: {
      alignRight: true,
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
          data: [{
            cellContent: '<a href="#" class="atm-text_link">Kanton Zürich</a>',
            isHighlighted: true,
          }, {
            cellContent: '1498643',
            isHighlighted: true,
          }, {
            cellContent: '15,2',
            isHighlighted: true,
          }, {
            cellContent: '1005751',
            isHighlighted: true,
          }],
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
      hasCaption: true,
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
      title: 'Mit Links und Aufzählungen',
      desc: 'Variante mit Links, Titel als H3',
    },
    props: {
      tableTitle: 'H3: 28px Black title Kontrollpunkt für mobile Geräte eingerichtet – den ersten in der Schweiz.',
      tableHeadingLevel: 3,
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
          data: ['<a href="#" class="atm-text_link">Gemeindesteuerfüsse 2019</a>', '<ul><li>Januar<ul><li>17. Januar</li><li>31. Januar</li></ul></li><li>Februar</li><li>März</li></ul>'],
        },
        {
          data: ['<a href="#" class="atm-text_link">Kantonale Bevölkerungsstatistik 2018 (prov.)</a>', '08. Februar'],
        },
        {
          data: ['<a href="#" class="atm-text_link">Abstimmungsanalyse</a>', '<ol><li>Ende Februar</li><li>Ende Mai</li><li>Ende September</li></ol>'],
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
          data: ['Zürich', '293', '4,5%', '68%', '1691<br>mehr Text in dieser Zelle', '1398', '487', '287'],
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
          data: ['Zürich', '293', '4,5%', '68%', '1691<br>mehr Text in dieser Zelle', '1398', '1691', '1398', '487', '287'],
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
  sortable: {
    meta: {
      title: 'Standard mit sortierbaren Spalten',
      desc: 'Ausgewählte Spalten können sortiert werden.',
    },
    props: {
      tableTitle: 'Beliebteste Filme im Kanton',
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
  sortableAlignRight: {
    meta: {
      title: 'Standard mit sortierbaren Spalten, rechtsbündig',
      desc: 'Ausgewählte Spalten können sortiert werden. Die ganze Tabelle ist rechtsbündig formatiert.',
    },
    props: {
      alignRight: true,
      tableTitle: 'Beliebteste Filme im Kanton',
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
  sortableFullWidth: {
    meta: {
      title: 'Volle Breite mit sortierbaren Spalten',
      desc: 'Ausgewählte Spalten können sortiert werden, die Tabelle geht über die volle Breite.',
    },
    props: {
      tableTitle: 'Beliebteste Filme im Kanton',
      isWide: true,
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
  sortableFullWidthAlignRight: {
    meta: {
      title: 'Volle Breite mit sortierbaren Spalten, rechtsbündig',
      desc: 'Ausgewählte Spalten können sortiert werden, die Tabelle geht über die volle Breite und ist rechtsbündig.',
    },
    props: {
      tableTitle: 'Beliebteste Filme im Kanton',
      isWide: true,
      alignRight: true,
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
  flexData: {
    meta: {
      title: 'Volle Breite statisch (Flexdata CZHDEV-1234)',
      desc: '',
    },
    props: {
      tableTitle: 'Steuerbuch',
      isWide: true,
      isStatic: true,
      preSortedColumn: 'zstb_nr',
      preSortedDirection: 'asc',
      headers: [
        {
          title: 'ZStB-Nr.',
          dataColumnName: 'zstb_nr',
          isSortable: 'enum',
        },
        {
          title: 'Kurztitel',
          dataColumnName: 'short',
          isSortable: 'alpha',
        },
        {
          title: 'Themenbereich',
          dataColumnName: 'topic',
          isSortable: 'alpha',
        },
        {
          isSortable: false,
        },
      ],
      bodyrows: [
        {
          data: ['3.1', 'Steuerliche Zugehörigkeit', 'Natürliche Personen', '<a class="atm-text_link" href="#">Details</a>'],
        },
        {
          data: ['800.1', 'Internationale Steuerausscheidung Betriebe/Vermögen', 'Natürliche Personen', '<a class="atm-text_link" href="#">Details</a>'],
        },
        {
          data: ['106.3', 'Einleitung des Nachsteuer- und Bussenverfahrens durch die DAIE', 'Verfahrensrecht', '<a class="atm-text_link" href="#">Details</a>'],
        },
        {
          data: ['109a.1', 'Ablieferung Steuererklärungen/Wertschriftenverzeichnisse', 'Verfahrensrecht', '<a class="atm-text_link" href="#">Details</a>'],
        },
        {
          data: ['51.2', 'Änderung der Besteuerungsgrundlagen während der Steuerperiode im interkantonalen Verhältnis', 'Natürliche Personen', '<a class="atm-text_link" href="#">Details</a>'],
        },
        {
          data: ['234.1', 'Verletzung von Verfahrenspflichten', 'Verfahrensrecht', '<a class="atm-text_link" href="#">Details</a>'],
        },
      ],
      caption: _.merge({}, defFigcaptionData, {
        caption: 'Quelle: Pro Cinema',
      }),
    },
  },
  taxCalcResult: {
    meta: {
      title: 'Steuerechner (CZHDEV-1238)',
      desc: 'Ergebnis Tabelle wie im Steuerrechner verwendet.',
    },
    props: {
      tableTitle: 'Steuerbarer Reingewinn',
      headers: [
        {
          title: '<span class="visuallyhidden">Beschreibung</span>',
          isSortable: false,
        }, {
          title: 'CHF',
          isSortable: false,
        },
      ],
      bodyrows: [
        {
          data: ['Gewinn vor Steuern', "1'000'000.00"],
        }, {
          data: ['Steuern  (auf Gewinn vor Steuern)', "216'222.00"],
        }, {
          data: ['mutmasslicher steuerbarer Reingewinn (ungerundet)', "783'778.00"],
        }, {
          data: [{
            cellContent: 'Steuerbarer Reingewinn (gerundet)',
            isHighlighted: true,
          }, {
            cellContent: "783'700.00",
            isHighlighted: true,
          }],
        },
      ],
      hasTitle: true,
      tableHeadingLevel: 4,
      hasColumnHeader: true,
      hasRowHeader: false,
      alignRight: true,
      colorVariation: true,
      isFirstColumnFixed: true,
      hasCaption: true,
      caption: _.merge({}, defFigcaptionData, {
        caption: 'Für die Steuerzahlung ist einzig der Betrag auf der Steuerrechnung massgebend.',
      }),
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
