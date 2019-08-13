/* eslint-disable no-template-curly-in-string */

const data = {
  labelTopics: 'Themen',
  filterField: {
    searchPage: '/content/zhweb/de/suche.html?q=${query}',
    noResultsLabel: 'Keine Resultate',
    searchInSiteSearchLabel: 'Gesamte Website nach «${query}» durchsuchen.',
  },
  pages: {
    middleSection: [
      {
        path: '/content/zhweb/de/gesundheit.html',
        title: 'Gesundheit',
        keywords: 'Krankenversicherung, Gesundheitsversorgung, Gesundheitsberufe, Gesund bleiben',
        synonyms: ['Krankenversicherung', 'Gesundsheitsversorgung', 'Gesundsheitsberufe', 'Gesund bleiben'],
        subpages: [{
          path: '/content/zhweb/de/gesundheit/sub.html',
          title: 'Gesundheit Sub',
          keywords: 'Keyword 1, Keyword 2',
          synonyms: ['Syn 1', 'Syn 2'],
          subpages: [{
            path: '/content/zhweb/de/gesundheit/sub/subsub1',
            title: 'Gesundheit Sub Sub 1',
            synonyms: ['G1', 'G2', 'G2'],
          }, {
            path: '/content/zhweb/de/gesundheit/sub/subsub2',
            title: 'Gesundheit Sub Sub 2',
          }],
        }],
      },
      {
        path: '/content/zhweb/de/familie.html',
        title: 'Familie',
        keywords: 'Partnerschaft, Eltern & Kinder, Unterstützung für Kinder & Jugendliche, Alter, Tod, Vormundschaft',
        synonyms: ['Partnerschaft', 'Eltern & Kinder', 'Unterstützung für Kinder & Jugendliche', 'Alter', 'Tod', 'Vormundschaft'],
        subpages: [{
          path: '/content/zhweb/de/familie/sub.html',
          title: 'Familie Sub',
          keywords: 'Keyword 1, Keyword 2',
          synonyms: ['Syn 1', 'Syn 2'],
          subpages: [{
            path: '/content/zhweb/de/familie/sub/subsub1',
            title: 'Familie Sub Sub 1',
            synonyms: ['G1', 'G2', 'G2'],
          }, {
            path: '/content/zhweb/de/familie/sub/subsub2',
            title: 'Familie Sub Sub 2',
          }],
        }],
      },
      {
        path: '/content/zhweb/de/soziales.html',
        title: 'Soziales',
        keywords: 'Arbeitslosigkeit, Finanzielle Hilfen, Sozialversicherungen, Beratungsangebote, Soziale Einrichtungen',
        synonyms: ['Arbeitslosigkeit', 'Finanzielle Hilfen', 'Sozialversicherungen', 'Beratungsangebote', 'Soziale Einrichtungen'],
        subpages: [{
          path: '/content/zhweb/de/soziales/sub.html',
          title: 'Soziales Sub',
          keywords: 'Keyword 1, Keyword 2',
          synonyms: ['Syn 1', 'Syn 2'],
          subpages: [{
            path: '/content/zhweb/de/soziales/sub/subsub1',
            title: 'Soziales Sub Sub 1',
            synonyms: ['G1', 'G2', 'G2'],
          }, {
            path: '/content/zhweb/de/soziales/sub/subsub2',
            title: 'Soziales Sub Sub 2',
          }],
        }],
      },
      {
        path: '/content/zhweb/de/bildung.html',
        title: 'Bildung',
        keywords: 'Bildungssystem, Schulen, Unterrichten, Schwierigkeiten in der Schule, Weiterbildung, Forschung, Bildungsgerechtigkeit',
        synonyms: ['Bildungssystem', 'Schulen', 'Unterrichten', 'Schwierigkeiten in der Schule', 'Weiterbildung', 'Forschung', 'Bildungsgerechtigkeit'],
        subpages: [{
          path: '/content/zhweb/de/bildung/sub.html',
          title: 'Bildung Sub',
          keywords: 'Keyword 1, Keyword 2',
          synonyms: ['Syn 1', 'Syn 2'],
          subpages: [{
            path: '/content/zhweb/de/bildung/sub/subsub1',
            title: 'Bildung Sub Sub 1',
            synonyms: ['G1', 'G2', 'G2'],
          }, {
            path: '/content/zhweb/de/bildung/sub/subsub2',
            title: 'Bildung Sub Sub 2',
          }],
        }],
      },
      {
        path: '/content/zhweb/de/sport-kultur.html',
        title: 'Sport & Kultur',
        keywords: 'Jugendsport, Sportförderung, Kulturpolitik, Kulturflrderung, Kulturpreise, Archäologie',
        synonyms: ['Jugendsport', 'Sportförderung', 'Kulturpolitik', 'Kulturflrderung', 'Kulturpreise', 'Archäologie'],
        subpages: [{
          path: '/content/zhweb/de/sport-kultur/sub.html',
          title: 'Sport & Kultur Sub',
          keywords: 'Keyword 1, Keyword 2',
          synonyms: ['Syn 1', 'Syn 2'],
          subpages: [{
            path: '/content/zhweb/de/sport-kultur/sub/subsub1',
            title: 'Sport & Kultur Sub Sub 1',
            synonyms: ['G1', 'G2', 'G2'],
          }, {
            path: '/content/zhweb/de/sport-kultur/sub/subsub2',
            title: 'Sport & Kultur Sub Sub 2',
          }],
        }],
      },
      {
        path: '/content/zhweb/de/wirtschaft-arbeit.html',
        title: 'Wirtschaft & Arbeit',
        keywords: 'Arbeitsmarkt, Arbeitnehmer- & Arbeitgeberverhältnis, Schwarzarbeit',
        synonyms: ['Arbeitsmarkt', 'Arbeitnehmer- & Arbeitgeberverhältnis', 'Schwarzarbeit'],
        subpages: [{
          path: '/content/zhweb/de/wirtschaft-arbeit/sub.html',
          title: 'Wirtschaft & Arbeit Sub',
          keywords: 'Keyword 1, Keyword 2',
          synonyms: ['Syn 1', 'Syn 2'],
          subpages: [{
            path: '/content/zhweb/de/wirtschaft-arbeit/sub/subsub1',
            title: 'Wirtschaft & Arbeit Sub Sub 1',
            synonyms: ['G1', 'G2', 'G2'],
          }, {
            path: '/content/zhweb/de/wirtschaft-arbeit/sub/subsub2',
            title: 'Wirtschaft & Arbeit Sub Sub 2',
          }],
        }],
      },
      {
        path: '/content/zhweb/de/steuern.html',
        title: 'Steuern',
        keywords: 'Steuererklärung, Steuern bezahlen, Grundlagen',
        synonyms: ['Steuererklärung', 'Steuern bezahlen', 'Grundlagen'],
        subpages: [{
          path: '/content/zhweb/de/steuern/sub.html',
          title: 'Steuern Sub',
          keywords: 'Keyword 1, Keyword 2',
          synonyms: ['Syn 1', 'Syn 2'],
          subpages: [{
            path: '/content/zhweb/de/steuern/sub/subsub1',
            title: 'Steuern Sub Sub 1',
            synonyms: ['G1', 'G2', 'G2'],
          }, {
            path: '/content/zhweb/de/steuern/sub/subsub2',
            title: 'Steuern Sub Sub 2',
          }],
        }],
      },
      {
        path: '/content/zhweb/de/mobilität.html',
        title: 'Mobilität',
        keywords: 'Reisen: Pass & ID, Fahren lernen, Führerausweis, Fahrzeuge, Autonummern, Gesamtverkehr, Öffentlicher Verkehr',
        synonyms: ['Reisen: Pass & ID', 'Fahren lernen', 'Führerausweis', 'Fahrzeuge', 'Autonummern', 'Gesamtverkehr', 'Öffentlicher Verkehr'],
        subpages: [{
          path: '/content/zhweb/de/mobilität/sub.html',
          title: 'Mobilität Sub',
          keywords: 'Keyword 1, Keyword 2',
          synonyms: ['Syn 1', 'Syn 2'],
          subpages: [{
            path: '/content/zhweb/de/mobilität/sub/subsub1',
            title: 'Mobilität Sub Sub 1',
            synonyms: ['G1', 'G2', 'G2'],
          }, {
            path: '/content/zhweb/de/mobilität/sub/subsub2',
            title: 'Mobilität Sub Sub 2',
          }],
        }],
      },
      {
        path: '/content/zhweb/de/bauen-planen.html',
        title: 'Bauen & Planen',
        keywords: 'Karten, Bauprojekte (Hochbau), Baubewilligung, Wohnbauförderung, Energie, Lärm',
        synonyms: ['Karten', 'Bauprojekte (Hochbau)', 'Baubewilligung', 'Wohnbauförderung', 'Energie', 'Lärm'],
        subpages: [{
          path: '/content/zhweb/de/bauen-planen/sub.html',
          title: 'Bauen & Planen Sub',
          keywords: 'Keyword 1, Keyword 2',
          synonyms: ['Syn 1', 'Syn 2'],
          subpages: [{
            path: '/content/zhweb/de/bauen-planen/sub/subsub1',
            title: 'Bauen & Planen Sub Sub 1',
            synonyms: ['G1', 'G2', 'G2'],
          }, {
            path: '/content/zhweb/de/bauen-planen/sub/subsub2',
            title: 'Bauen & Planen Sub Sub 2',
          }],
        }],
      },
      {
        path: '/content/zhweb/de/umwelt-tier.html',
        title: 'Umwelt & Tier',
        keywords: 'Tier, Umweltschutz, Boden, Wald & Pflanzen, Wasser, Luft, Politik & Staat',
        synonyms: ['Tier', 'Umweltschutz', 'Boden', 'Wald & Pflanzen', 'Wasser', 'Luft', 'Politik & Staat'],
        subpages: [{
          path: '/content/zhweb/de/umwelt-tier/sub.html',
          title: 'Umwelt & Tier Sub',
          keywords: 'Keyword 1, Keyword 2',
          synonyms: ['Syn 1', 'Syn 2'],
          subpages: [{
            path: '/content/zhweb/de/umwelt-tier/sub/subsub1',
            title: 'Umwelt & Tier Sub Sub 1',
            synonyms: ['G1', 'G2', 'G2'],
          }, {
            path: '/content/zhweb/de/umwelt-tier/sub/subsub2',
            title: 'Umwelt & Tier Sub Sub 2',
          }],
        }],
      },
      {
        path: '/content/zhweb/de/gesundheit.html',
        title: 'Wahlen & Abstimmungen',
        keywords: 'Bezirke, Gemeinden, Daten & Statistik, Recht & Gesetze, Beschlüsse, Vernehmlassungen',
        synonyms: ['Bezirke', 'Gemeinden', 'Daten & Statistik', 'Recht & Gesetze', 'Beschlüsse', 'Vernehmlassungen'],
        subpages: [{
          path: '/content/zhweb/de/gesundheit/sub.html',
          title: 'Wahlen & Abstimmungen Sub',
          keywords: 'Keyword 1, Keyword 2',
          synonyms: ['Syn 1', 'Syn 2'],
          subpages: [{
            path: '/content/zhweb/de/gesundheit/sub/subsub1',
            title: 'Wahlen & Abstimmungen Sub Sub 1',
            synonyms: ['G1', 'G2', 'G2'],
          }, {
            path: '/content/zhweb/de/gesundheit/sub/subsub2',
            title: 'Wahlen & Abstimmungen Sub Sub 2',
          }],
        }],
      },
      {
        path: '/content/zhweb/de/migration-integration.html',
        title: 'Migration & Integration',
        keywords: 'Willkommen im Kanton Zürich, Einreise, Aufenthalt, Wegweisung, Asyl, Integration, Einbürgerung',
        synonyms: ['Willkommen im Kanton Zürich', 'Einreise', 'Aufenthalt', 'Wegweisung', 'Asyl', 'Integration', 'Einbürgerung'],
        subpages: [{
          path: '/content/zhweb/de/migration-integration/sub.html',
          title: 'Migration & Integration Sub',
          keywords: 'Keyword 1, Keyword 2',
          synonyms: ['Syn 1', 'Syn 2'],
          subpages: [{
            path: '/content/zhweb/de/migration-integration/sub/subsub1',
            title: 'Migration & Integration Sub Sub 1',
            synonyms: ['G1', 'G2', 'G2'],
          }, {
            path: '/content/zhweb/de/migration-integration/sub/subsub2',
            title: 'Migration & Integration Sub Sub 2',
          }],
        }],
      },
      {
        path: '/content/zhweb/de/sicherheit-justiz.html',
        title: 'Sicherheit & Justiz',
        keywords: 'Polizeimeldungen, Bussen, ePolice, Strafanzeige, Prävention, Kriminalität',
        synonyms: ['Polizeimeldungen', 'Bussen', 'ePolice', 'Strafanzeige', 'Prävention', 'Kriminalität'],
        subpages: [{
          path: '/content/zhweb/de/sicherheit-justiz/sub.html',
          title: 'Sicherheit & Justiz Sub',
          keywords: 'Keyword 1, Keyword 2',
          synonyms: ['Syn 1', 'Syn 2'],
          subpages: [{
            path: '/content/zhweb/de/sicherheit-justiz/sub/subsub1',
            title: 'Sicherheit & Justiz Sub Sub 1',
            synonyms: ['G1', 'G2', 'G2'],
          }, {
            path: '/content/zhweb/de/sicherheit-justiz/sub/subsub2',
            title: 'Sicherheit & Justiz Sub Sub 2',
          }],
        }],
      },
      {
        path: '/content/zhweb/de/ueber-den-kanton.html',
        title: 'Über den Kanton',
        keywords: 'Zahlen & Fakten, So funktioniert der Kanton, Grossprojekte, Ausgewählte Publikationen',
        synonyms: ['Zahlen & Fakten', 'So funktioniert der Kanton', 'Grossprojekte', 'Ausgewählte Publikationen'],
        subpages: [{
          path: '/content/zhweb/de/ueber-den-kanton/sub.html',
          title: 'Über den Kanton Sub',
          keywords: 'Keyword 1, Keyword 2',
          synonyms: ['Syn 1', 'Syn 2'],
          subpages: [{
            path: '/content/zhweb/de/ueber-den-kanton/sub/subsub1',
            title: 'Über den Kanton Sub Sub 1',
            synonyms: ['G1', 'G2', 'G2'],
          }, {
            path: '/content/zhweb/de/ueber-den-kanton/sub/subsub2',
            title: 'Über den Kanton Sub Sub 2',
          }],
        }],
      },
    ],
  },
};

module.exports = data;
