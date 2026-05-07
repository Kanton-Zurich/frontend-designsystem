const data = {
  results: [
    {
      type: 'news',
      typeLabel: 'News',
      date: '14.12.2018',
      title: 'Zürcher Längsschnittstudie',
      teaserText: 'Falls Sie einen ausländischen Führerausweis besitzen und in der Schweiz wohnen.',
      link: 'http://search.zh.ch/xyl',
      publicationType: 'Medienmitteilung',
      isTopResult: true,
    },
    {
      type: 'contentpage',
      typeLabel: 'Inhaltsseite',
      title: 'Führerausweis umtauschen',
      teaserText:
        'Falls Sie einen ausländischen Führerausweis besitzen und in der Schweiz wohnen, müssen Sie diesen innert 12 Monaten umtauschen.',
      breadcrumb: 'Mobilität ‣ Führerausweis ‣ Umtausch ausländischer Ausweis',
      link: 'http://search.zh.ch/abc1',
      isTopResult: false,
    },
    {
      type: 'contentpage',
      typeLabel: 'Inhaltsseite',
      title: 'Gültigkeit des Führerausweises im Ausland',
      teaserText:
        'Ihr Schweizer Führerausweis ist in den meisten europäischen Ländern gültig. Bitte erkundigen Sie sich vorab über spezifische Regelungen.',
      breadcrumb: 'Mobilität ‣ Führerausweis ‣ Ausland',
      link: 'http://search.zh.ch/abc2',
      isTopResult: false,
    },
    {
      type: 'contentpage',
      typeLabel: 'Inhaltsseite',
      title: 'Führerausweis auf Probe',
      teaserText:
        'Neulenkende erhalten den Führerausweis auf Probe. Dieser ist 3 Jahre gültig und erfordert den Besuch eines Weiterbildungskurses.',
      breadcrumb: 'Mobilität ‣ Führerausweis ‣ Führerausweis auf Probe',
      link: 'http://search.zh.ch/abc3',
      isTopResult: false,
    },
    {
      type: 'contentpage',
      typeLabel: 'Inhaltsseite',
      title: 'Führerausweis beantragen',
      teaserText:
        'Hier erfahren Sie, welche Unterlagen für den Antrag eines Lernfahrausweises oder Führerausweises notwendig sind.',
      breadcrumb: 'Mobilität ‣ Führerausweis ‣ Antrag stellen',
      link: 'http://search.zh.ch/abc6',
      isTopResult: false,
    },
    {
      type: 'contentpage',
      typeLabel: 'Inhaltsseite',
      title: 'Altersgrenzen für Führerausweise',
      teaserText:
        'Für verschiedene Fahrzeugkategorien gelten unterschiedliche Altersgrenzen. Prüfen Sie, ab wann Sie welche Fahrzeuge fahren dürfen.',
      breadcrumb: 'Mobilität ‣ Führerausweis ‣ Altersgrenzen',
      link: 'http://search.zh.ch/abc7',
      isTopResult: false,
    },
    {
      type: 'contentpage',
      typeLabel: 'Inhaltsseite',
      title: 'Führerausweis und Gesundheitsnachweis',
      teaserText:
        'Ab einem gewissen Alter oder für bestimmte Kategorien ist ein ärztlicher Gesundheitsnachweis erforderlich.',
      breadcrumb: 'Mobilität ‣ Führerausweis ‣ Gesundheit',
      link: 'http://search.zh.ch/abc8',
      isTopResult: false,
    },
    {
      type: 'contentpage',
      typeLabel: 'Inhaltsseite',
      title: 'Digitale Kopie des Führerausweises',
      teaserText:
        'Erfahren Sie, wie Sie eine digitale Kopie Ihres Führerausweises für mobile Nutzung beantragen können.',
      breadcrumb: 'Mobilität ‣ Führerausweis ‣ Digital',
      link: 'http://search.zh.ch/abc9',
      isTopResult: false,
    },
  ],
  resultsData: {
    numberOfResultPages: 123,
    numberOfResults: 1000,
    queryId: 'awef123',
    resultsByType: [
      {
        type: 'contentpage',
        numberOfResultPages: 9,
        numberOfResults: 105,
        typeLabel: 'Inhaltsseiten',
      },
      {
        type: 'service',
        numberOfResultPages: 2,
        numberOfResults: 32,
        typeLabel: 'Services',
      },
      {
        type: 'news',
        numberOfResultPages: 3,
        numberOfResults: 42,
        typeLabel: 'News',
      },
      {
        type: 'document',
        numberOfResultPages: 1,
        numberOfResults: 8,
        typeLabel: 'Dokumente',
      },
      {
        type: 'person',
        numberOfResultPages: 1,
        numberOfResults: 3,
        typeLabel: 'Personen',
      },
      {
        type: 'event',
        numberOfResultPages: 2,
        numberOfResults: 14,
        typeLabel: 'Veranstaltungen',
      },
    ],
  },
  didYouMean: ['Schule', 'Scuol', 'Schuhe'],
  similarTerms: ['Schulferien Kalender', 'Schulzulassungprüfung', 'Schulpflege'],
  autoCorrectedTerm: 'Zürich',
};

module.exports = data;
