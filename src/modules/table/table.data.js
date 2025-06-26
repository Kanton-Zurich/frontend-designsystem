const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const defFigcaptionData = require('../../atoms/figcaption/figcaption.data').variants.default;
const dataDownloadVariants = require('../data_download/data_download.data').variants;

const highlightColumn = (index) => {
  // eslint-disable-next-line no-magic-numbers
  if (index === 3 || index === 5) {
    return true;
  } else {
    return false;
  }
};
const highlightHeaderCell = (cell, index) => {
  if (highlightColumn(index)) {
    return {
      ...cell,
      highlightColumn: true,
    };
  } else {
    return cell;
  }
};
const highlightBodyCell = (row) => {
  return {
    ...row,
    data: row.data.map((cell, index) => {
      if (highlightColumn(index)) {
        return {
          cellContent: cell,
          highlightColumn: true,
        };
      } else {
        return cell;
      }
    }),
  };
};

const tableFinanceHeaderRowData = [
  {
    title: '<span class="visuallyhidden">???</span>',
    isSortable: false,
  },
  {
    title: 'R22',
    isSortable: true,
  },
  {
    title: 'B23',
    isSortable: false,
  },
  {
    title: 'B24',
    isSortable: true,
  },
  {
    title: '△ abs.',
    isSortable: false,
  },
  {
    title: '△ %',
    isSortable: false,
  },
  {
    title: 'P25',
    isSortable: false,
  },
  {
    title: 'P26',
    isSortable: false,
  },
  {
    title: 'P27',
    isSortable: false,
  },
];
const tableFinanceBodyRowData = [
  {
    data: ['Erfolgsrechnung', '', '', '', '', '', '', '', ''],
    lineBottom: true,
  },
  {
    data: [
      'Betrieblicher Aufwand',
      "-18'041",
      "-17'890",
      "-18'998",
      '-1108',
      '-6.2%',
      "-19'053",
      "-19'287",
      "-19'526",
    ],
  },
  {
    data: [
      'Betrieblicher Ertrag',
      '18 193',
      '17 311',
      "-18'998",
      '889',
      '5.1%',
      '18 208',
      '18 538',
      '18 852',
    ],
    lineBottomBold: true,
  },
  {
    data: [
      'Ergebnis aus betrieblicher Tätigkeiten des aktuellen Jahres (detaillierte Aufschlüsselung und Analyse)',
      '152',
      '-579',
      '-797',
      '-219',
      '',
      '-749',
      '-673',
      '-845',
    ],
    bold: true,
    lineBottom: true,
  },
  {
    data: ['Finanzertrag', '466', '419', '515', '96', '22.8%', '535', '541', ''],
    spaceTop: true,
  },
  {
    data: ['Finanzaufwand', '-75', '-82', '-107', '-25', '-133.1%', '-148', '-164', ''],
    lineBottomBold: true,
  },
  {
    data: ['Finanzergebnis', '337', '408', '71', '-219', '-219.2%', '389', '-673', '377'],
    lineBottom: true,
    bold: true,
  },
  {
    data: ['Total Ertrag', '466', '419', '515', '96', '22.8%', '535', '541', ''],
    spaceTop: true,
  },
  {
    data: ['Total Aufwand', '-75', '-82', '-107', '-25', '-133%', '-148', '-164', ''],
    lineBottomBold: true,
  },
  {
    data: ['Saldo Erfolgsrechnung', '337', '408', '71', '-219', '-219%', '389', '-673', '377'],
    lineBottom: true,
  },
  {
    data: ['Finanzierungsrechnung', '', '', '', '', '', '', '', ''],
    spaceTop: true,
    lineBottomBold: true,
    bold: true,
  },
  {
    data: [
      'Saldo Finanzierungsrechnung',
      '337',
      '408',
      '71',
      '-219',
      '-219%',
      '389',
      '-673',
      '377',
    ],
    bold: true,
    lineBottom: true,
  },
  {
    data: ['Kennzahlen', '', '', '', '', '', '', '', ''],
    spaceTop: true,
    bold: true,
    lineBottom: true,
  },
  {
    data: ['Eigenkapital', '466', '419', "-18'998", '466', '-6.2%', '466', '419', '-164'],
  },
  {
    data: [
      'Selbstfinanzierungsgrad in %',
      '-148',
      '466',
      "-18'998",
      '889',
      '5.1%',
      '419',
      '-148',
      '-164',
    ],
  },
  {
    data: [
      'Selbstfinanzierungsgrad in %',
      '-148',
      '466',
      "-18'998",
      '889',
      '5.1%',
      '419',
      '-148',
      '-164',
    ],
  },
];
const tableFinanceHeaderRowDataHighlightedColumn =
  tableFinanceHeaderRowData.map(highlightHeaderCell);
const tableFinanceBodyRowDataHighlightedColumn = tableFinanceBodyRowData.map(highlightBodyCell);
const tableFinanceBodyRowDataZebra = [
  {
    data: [
      'Betrieblicher Aufwand',
      "-18'041",
      "-17'890",
      "-18'998",
      '-1108',
      '-6.2%',
      "-19'053",
      "-19'287",
      "-19'526",
    ],
  },
  {
    data: [
      'Betrieblicher Ertrag',
      '18 193',
      '17 311',
      "-18'998",
      '889',
      '5.1%',
      '18 208',
      '18 538',
      '18 852',
    ],
  },
  {
    data: [
      'Ergebnis aus betrieblicher Tätigkeit mit ein paar extra Wörtern',
      '152',
      '-579',
      '-797',
      '-219',
      '',
      '-749',
      '-673',
      '-845',
    ],
  },
  {
    data: ['Finanzertrag', '466', '419', '515', '96', '22.8%', '535', '541', ''],
  },
  {
    data: ['Finanzaufwand', '-75', '-82', '-107', '-25', '-133.1%', '-148', '-164', ''],
  },
  {
    data: ['Finanzergebnis', '337', '408', '71', '-219', '-219.2%', '389', '-673', '377'],
  },
  {
    data: ['Total Ertrag', '466', '419', '515', '96', '22.8%', '535', '541', ''],
  },
  {
    data: ['Total Aufwand', '-75', '-82', '-107', '-25', '-133%', '-148', '-164', ''],
  },
  {
    data: ['Saldo Erfolgsrechnung', '337', '408', '71', '-219', '-219%', '389', '-673', '377'],
  },
  {
    data: [
      'Saldo Finanzierungsrechnung',
      '337',
      '408',
      '71',
      '-219',
      '-219%',
      '389',
      '-673',
      '377',
    ],
  },
  {
    data: ['Eigenkapital', '466', '419', "-18'998", '466', '-6.2%', '466', '419', '-164'],
  },
  {
    data: [
      'Selbstfinanzierungsgrad in %',
      '-148',
      '466',
      "-18'998",
      '889',
      '5.1%',
      '419',
      '-148',
      '-164',
    ],
  },
  {
    data: [
      'Selbstfinanzierungsgrad in %',
      '-148',
      '466',
      "-18'998",
      '889',
      '5.1%',
      '419',
      '-148',
      '-164',
    ],
  },
];
const tableFinanceBodyRowDataZebraHiglightedColumn =
  tableFinanceBodyRowDataZebra.map(highlightBodyCell);

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
      },
      {
        title: 'Einwohnerzahl 2017',
        isSortable: false,
      },
      {
        title: 'Bevölkerungswachstum<br> 2007–2017 in %',
        isSortable: false,
      },
      {
        title: 'Beschäftigte 2015',
        isSortable: false,
      },
    ],
    bodyrows: [
      {
        data: [
          {
            cellContent: '<a href="#" class="atm-text_link">Kanton Zürich</a>',
            isHighlighted: true,
          },
          {
            cellContent: '1498643',
            isHighlighted: true,
          },
          {
            cellContent: '15,2',
            isHighlighted: true,
          },
          {
            cellContent: '1005751',
            isHighlighted: true,
          },
        ],
      },
      {
        data: ['Affoltern', '53531', '18,4', '17171'],
      },
      {
        data: ['Andelfingen', '31140', '9,6', '11094'],
      },
      {
        data: ['Bülach', '148897', '21,3', '110370'],
      },
      {
        data: ['Dielsdorf', '89221', '19,1', '38164'],
      },
    ],
    hasTitle: true,
    headingLevel: 2,
    visualHeadingLevel: 2,
    hasColumnHeader: true,
    hasRowHeader: false,
    hasCaption: false,
    alignRight: false,
    colorVariation: false,
    isFirstColumnFixed: false,
  },
});
const variants = _.mapValues(
  {
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
          },
          {
            title:
              'Einwohnerzahl<sup>1</sup> <span class="visuallyhidden">Nach zivilrechtlichem Wohnsitzbegriff, Daten per Ende Jahr</span> 2017',
            isSortable: false,
          },
          {
            title: 'Bevölkerungswachstum<br> 2007–2017 in %',
            isSortable: false,
          },
          {
            title: 'Beschäftigte 2015',
            isSortable: false,
          },
        ],
        bodyrows: [
          {
            data: [
              {
                cellContent: '<a href="#" class="atm-text_link">Kanton Zürich</a>',
                isHighlighted: true,
              },
              {
                cellContent: '1498643',
                isHighlighted: true,
              },
              {
                cellContent: '15,2',
                isHighlighted: true,
              },
              {
                cellContent: '1005751',
                isHighlighted: true,
              },
            ],
          },
          {
            data: [
              'Affoltern<sup>2</sup> <span class="visuallyhidden">Stand 2016</span>',
              '53531',
              '18,4',
              '17171',
            ],
          },
          {
            data: ['Andelfingen', '31140', '9,6', '11094'],
          },
          {
            data: ['Bülach', '148897', '21,3', '110370'],
          },
          {
            data: ['Dielsdorf', '89221', '19,1', '38164'],
          },
        ],
        caption: _.merge({}, defFigcaptionData, {
          caption:
            '<sup>1</sup> Nach zivilrechtlichem Wohnsitzbegriff, Daten per Ende Jahr<br><sup>2</sup> Stand 2016',
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
        tableTitle:
          'H3: 28px Black title Kontrollpunkt für mobile Geräte eingerichtet – den ersten in der Schweiz.',
        headingLevel: 3,
        visualHeadingLevel: 3,
        hasCaption: false,
        headers: [
          {
            title: 'Daten/Publikation',
            isSortable: false,
          },
          {
            title: 'Termin',
            isSortable: false,
          },
        ],
        bodyrows: [
          {
            data: [
              '<a href="#" class="atm-text_link">Gemeindesteuerfüsse 2019</a>',
              '<ul><li>Januar<ul><li>17. Januar</li><li>31. Januar</li></ul></li><li>Februar</li><li>März</li></ul>',
            ],
          },
          {
            data: [
              '<a href="#" class="atm-text_link">Kantonale Bevölkerungsstatistik 2018 (prov.)</a>',
              '08. Februar',
            ],
          },
          {
            data: [
              '<a href="#" class="atm-text_link">Abstimmungsanalyse</a>',
              '<ol><li>Ende Februar</li><li>Ende Mai</li><li>Ende September</li></ol>',
            ],
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
        headingLevel: 4,
        visualHeadingLevel: 4,
        hasRowHeader: true,
        alignRight: true,
        headers: [
          {
            title: '<span class="visuallyhidden">Alterssegment</span>',
            isSortable: false,
          },
          {
            title: 'Kanton Zürich',
            isSortable: false,
          },
          {
            title: 'Stadt Zürich',
            isSortable: false,
          },
          {
            title: 'Übriger Kanton ZH',
            isSortable: false,
          },
          {
            title: 'Schweiz',
            isSortable: false,
          },
          {
            title: 'Schweiz ohne<br>Kanton ZH',
            isSortable: false,
          },
        ],
        bodyrows: [
          {
            data: ['0–19 Jahre', '293', '68', '225', '1691', '1398'],
          },
          {
            data: ['20–39 Jahre', '293', '68', '225', '1691', '1398'],
          },
          {
            data: ['40–64 Jahre', '293', '68', '225', '1691', '1398'],
          },
          {
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
        headingLevel: 3,
        visualHeadingLevel: 3,
        hasCaption: true,
        isFirstColumnFixed: true,
        hasRowHeader: true,
        alignRight: true,
        headers: [
          {
            title: '<span class="visuallyhidden">Region</span>',
            isSortable: false,
          },
          {
            title: 'Arbeitsstätten',
            isSortable: false,
          },
          {
            title: 'Anteil an der Gesamtwirtschaft',
            isSortable: false,
          },
          {
            title: 'Anteil an der Gesamtschweiz',
            isSortable: false,
          },
          {
            title: 'Beschäftigte Vollzeit',
            isSortable: false,
          },
          {
            title: 'Beschäftigte Teilzeit',
            isSortable: false,
          },
          {
            title: 'Gesamtumsatz* in Mio. CHF',
            isSortable: false,
          },
          {
            title: 'Bruttowertschöpfung** in Mio. CHF',
            isSortable: false,
          },
        ],
        bodyrows: [
          {
            data: [
              'Zürich',
              '293',
              '4,5%',
              '68%',
              '1691<br>mehr Text in dieser Zelle',
              '1398',
              '487',
              '287',
            ],
          },
          {
            data: ['Bern', '293', '4,5%', '68%', '1691', '1398', '487', '287'],
          },
          {
            data: ['Basel', '293', '4,5%', '68%', '1691', '1398', '487', '287'],
          },
          {
            data: [
              'Gesamtschweiz und Fürstentum Lichtenstein',
              '293',
              '4,5%',
              '68%',
              '1691',
              '1398',
              '487',
              '287',
            ],
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
        headingLevel: 3,
        visualHeadingLevel: 3,
        hasCaption: true,
        isWide: true,
        isFirstColumnFixed: true,
        hasRowHeader: true,
        alignRight: true,
        headers: [
          {
            title: '<span class="visuallyhidden">Region</span>',
            isSortable: false,
          },
          {
            title: 'Arbeitsstätten',
            isSortable: false,
          },
          {
            title: 'Anteil an der Gesamtwirtschaft',
            isSortable: false,
          },
          {
            title: 'Anteil an der Gesamtschweiz',
            isSortable: false,
          },
          {
            title: 'Beschäftigte Vollzeit',
            isSortable: false,
          },
          {
            title: 'Beschäftigte Teilzeit',
            isSortable: false,
          },
          {
            title: 'Beschäftigte Vollzeit Vorjahr',
            isSortable: false,
          },
          {
            title: 'Beschäftigte Teilzeit Vorjahr',
            isSortable: false,
          },
          {
            title: 'Gesamtumsatz* in Mio. CHF',
            isSortable: false,
          },
          {
            title: 'Bruttowertschöpfung** in Mio. CHF',
            isSortable: false,
          },
        ],
        bodyrows: [
          {
            data: [
              'Zürich',
              '293',
              '4,5%',
              '68%',
              '1691<br>mehr Text in dieser Zelle',
              '1398',
              '1691',
              '1398',
              '487',
              '287',
            ],
          },
          {
            data: ['Bern', '293', '4,5%', '68%', '1691', '1398', '1691', '1398', '487', '287'],
          },
          {
            data: ['Basel', '293', '4,5%', '68%', '1691', '1398', '1691', '1398', '487', '287'],
          },
          {
            data: [
              'Gesamtschweiz und Fürstentum Lichtenstein',
              '293',
              '4,5%',
              '68%',
              '1691',
              '1398',
              '1691',
              '1398',
              '487',
              '287',
            ],
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
        headingLevel: 3,
        visualHeadingLevel: 3,
        hasCaption: true,
        isFirstColumnFixed: true,
        hasRowHeader: true,
        alignRight: true,
        headers: [
          {
            title: '<span class="visuallyhidden">Region</span>',
            isSortable: 'alpha',
          },
          {
            title: 'Arbeitsstätten',
            isSortable: false,
          },
          {
            title: 'Anteil an der Gesamtwirtschaft',
            isSortable: 'enum',
          },
          {
            title: 'Anteil an der Gesamtschweiz',
            isSortable: 'enum',
          },
          {
            title: 'Beschäftigte Vollzeit',
            isSortable: 'enum',
          },
          {
            title: 'Beschäftigte Teilzeit',
            isSortable: 'enum',
          },
          {
            title: 'Gesamtumsatz* in Mio. CHF',
            isSortable: 'enum',
          },
          {
            title: 'Bruttowertschöpfung** in Mio. CHF',
            isSortable: 'enum',
          },
        ],
        bodyrows: [
          {
            data: ['Zürich', '34', '3%', '68%', '1691', '1390', '34', '247'],
          },
          {
            data: ['Bern', '555', '4%', '68%', '1692', '1398', '54', '2457'],
          },
          {
            data: ['Basel', '222', '4,5%', '68%', '1693', '2000', '34', '245'],
          },
          {
            data: ['Gesamtschweiz', '787', '5%', '68%', '1000', '5434', '487', '435'],
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
            data: [
              '3.1',
              'Steuerliche Zugehörigkeit',
              'Natürliche Personen',
              '<a class="atm-text_link" href="#">Details</a>',
            ],
          },
          {
            data: [
              '800.1',
              'Internationale Steuerausscheidung Betriebe/Vermögen',
              'Natürliche Personen',
              '<a class="atm-text_link" href="#">Details</a>',
            ],
          },
          {
            data: [
              '106.3',
              'Einleitung des Nachsteuer- und Bussenverfahrens durch die DAIE',
              'Verfahrensrecht',
              '<a class="atm-text_link" href="#">Details</a>',
            ],
          },
          {
            data: [
              '109a.1',
              'Ablieferung Steuererklärungen/Wertschriftenverzeichnisse',
              'Verfahrensrecht',
              '<a class="atm-text_link" href="#">Details</a>',
            ],
          },
          {
            data: [
              '51.2',
              'Änderung der Besteuerungsgrundlagen während der Steuerperiode im interkantonalen Verhältnis',
              'Natürliche Personen',
              '<a class="atm-text_link" href="#">Details</a>',
            ],
          },
          {
            data: [
              '234.1',
              'Verletzung von Verfahrenspflichten',
              'Verfahrensrecht',
              '<a class="atm-text_link" href="#">Details</a>',
            ],
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
          },
          {
            title: 'CHF',
            isSortable: false,
          },
        ],
        bodyrows: [
          {
            data: ['Gewinn vor Steuern', "1'000'000.00"],
          },
          {
            data: ['Steuern  (auf Gewinn vor Steuern)', "216'222.00"],
          },
          {
            data: ['mutmasslicher steuerbarer Reingewinn (ungerundet)', "783'778.00"],
          },
          {
            data: [
              {
                cellContent: 'Steuerbarer Reingewinn (gerundet)',
                isHighlighted: true,
              },
              {
                cellContent: "783'700.00",
                isHighlighted: true,
              },
            ],
          },
        ],
        hasTitle: true,
        headingLevel: 4,
        visualHeadingLevel: 4,
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
    eDirectoryMember: {
      meta: {
        title: 'Behördenverzeichnis Mitglieder',
        desc: '',
      },
      props: {
        tableTitle: 'Mitglieder',
        headingLevel: 2,
        visualHeadingLevel: 3,
        isWide: false,
        eDirectory: true,
        spa: false,
        headers: [
          {
            title: 'Vorname',
            isSortable: false,
          },
          {
            title: 'Nachname',
            isSortable: false,
          },
          {
            title: 'Funktion',
            isSortable: false,
          },
          {
            title: 'E-Mail',
            isSortable: false,
          },
          {
            title: 'Telefon',
            isSortable: false,
          },
          {
            title: 'Website',
            isSortable: false,
          },
        ],
        bodyrows: [
          {
            data: [
              'Emma',
              'Muster',
              'Chef',
              'emma.muster@gerichte-zh.ch',
              '+41449524799',
              'https://www.gerichte-zh',
            ],
          },
          {
            data: [
              'Emma',
              'Muster',
              'Chef',
              'emma.muster@gerichte-zh.ch',
              '+41449524799',
              'https://www.gerichte-zh',
            ],
          },
          {
            data: [
              'Emma',
              'Muster',
              'Chef',
              'emma.muster@gerichte-zh.ch',
              '+41449524799',
              'https://www.gerichte-zh',
            ],
          },
        ],
      },
    },
    eDirectoryMemberSpa: {
      meta: {
        title: 'Behördenverzeichnis Mitglieder SPA',
        desc: '',
      },
      props: {
        tableTitle: 'Mitglieder',
        headingLevel: 2,
        visualHeadingLevel: 3,
        isWide: false,
        eDirectory: true,
        spa: true,
        tableHeaderLabels: JSON.stringify({
          name: 'Name',
          jobTitle: 'Funktion',
          email: 'E-Mail',
          phone: 'Telefon',
          website: 'Webseite',
        }),
        headers: [],
        bodyrows: [],
        pagination: {
          headingLevel: 3,
        },
      },
    },
    eDirectoryResultsSpa: {
      meta: {
        title: 'Behördenverzeichnis Ergebnisse SPA',
        desc: 'Suchresultate der Behördenverzeichnis Suche.',
      },
      props: {
        hasTitle: true,
        tableTitle: '<span></span> Ergebnisse',
        visualHeadingLevel: 3,
        headingLevel: 3,
        isWide: true,
        eDirectory: true,
        spa: true,
        tableHeaderLabels: JSON.stringify({
          title: 'Behörde',
          leaders: 'Leitung',
          breadcrumbs: 'Organisation',
        }),
        headers: [],
        bodyrows: [],
        pagination: {
          headingLevel: 4,
        },
      },
    },
    finance: {
      meta: {
        title: 'Finanztabelle',
        desc: 'Erweiterte Finanz Tabelle',
      },
      props: {
        whiteBackground: true,
        tableTitle: 'Finanztabelle',
        isFinanceTable: true,
        headingLevel: 2,
        visualHeadingLevel: 2,
        hasCaption: true,
        isWide: true,
        isFirstColumnFixed: true,
        hasRowHeader: true,
        alignRight: true,
        headers: tableFinanceHeaderRowDataHighlightedColumn,
        bodyrows: tableFinanceBodyRowDataHighlightedColumn,
        caption: {
          caption: `
          <p>Diese Tabelle zeigt die finanziellen Kennzahlen des Kantons Zürich über mehrere Jahre hinweg. Sie enthält Informationen zur Erfolgsrechnung, Finanzierungsrechnung und wichtigen Finanzkennzahlen.</p>
          Quelle: <a class="atm-text_link"href="#">Statistisches Amt des Kantons Zürich</a>
        `,
        },
        dataDownload: dataDownloadVariants.singleFile.props,
      },
    },
    financeZebra: {
      meta: {
        title: 'Finanztabelle Zebra',
        desc: 'Erweiterte Finanz Tabelle mit Zebra Muster',
      },
      props: {
        tableTitle: 'Finanztabelle',
        isFinanceTable: true,
        headingLevel: 3,
        visualHeadingLevel: 3,
        isWide: true,
        isFirstColumnFixed: true,
        hasRowHeader: true,
        alignRight: true,
        headers: tableFinanceHeaderRowData,
        bodyrows: tableFinanceBodyRowDataZebra,
      },
    },
    financeZebraHighlightedColum: {
      meta: {
        title: 'Finanztabelle (Zebra) mit hervorgehobenen Spalten',
        desc: 'Erweiterte Finanz Tabelle mit Zebra Muster und hervorgehobenen Spalten. Zebra Muster ist aktiv, wird aber von den hervorgehobenen Spalten deaktiviert.',
      },
      props: {
        tableTitle: 'Finanztabelle',
        isFinanceTable: true,
        headingLevel: 4,
        visualHeadingLevel: 4,
        isWide: true,
        isFirstColumnFixed: true,
        hasRowHeader: true,
        alignRight: true,
        headers: tableFinanceHeaderRowDataHighlightedColumn,
        bodyrows: tableFinanceBodyRowDataZebraHiglightedColumn,
      },
    },
  },
  (variant) => {
    const variantProps = _.mergeWith({}, data, variant, (_dataValue, variantValue, key) => {
      if (key === 'bodyrows' || key === 'headers') {
        return variantValue;
      }
    }).props;

    const compiledVariant = () => handlebars.compile(template)(variantProps);
    const variantData = _.mergeWith(
      {},
      data,
      variant,
      {
        meta: {
          demo: compiledVariant,

          code: {
            handlebars: dataHelper.getFormattedHandlebars(template),
            html: dataHelper.getFormattedHtml(compiledVariant()),
            data: dataHelper.getFormattedJson(variantProps),
          },
        },
      },
      (_dataValue, variantValue, key) => {
        if (key === 'bodyrows' || key === 'headers') {
          return variantValue;
        }
      }
    );

    return variantData;
  }
);

data.variants = variants;

module.exports = data;
