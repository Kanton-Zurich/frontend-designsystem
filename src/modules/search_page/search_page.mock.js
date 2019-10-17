const data = {
  results: [{
    type: 'contentpage',
    title: 'Internationaler Führerausweis',
    teaserText: 'In nicht englischsprachigen Ländern ausserhalb der EU empfehlen wir Ihnen, einen internationalen Führerschein ausstellen zu lassen.',
    breadcrumb: 'Kanton Zürich > Führereausweis > Internationaler Führerausweis',
    link: 'http://search.zh.ch/xyz',
    typeLabel: 'Inhaltsseite',
  }, {
    type: 'news',
    date: '14.12.2018',
    title: 'Zürcher Längsschnitstudie',
    teaserText: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum ',
    link: 'http://search.zh.ch/xyl',
    typeLabel: 'News',
  }, {
    type: 'service',
    title: 'Internationalen Führerschein beantragen',
    teaserText: 'In nicht englischsprachigen Ländern ausserhalb der EU empfehlen wir Ihnen, einen internationalen Führerschein ausstellen zu lassen.',
    link: '/pages/service/service.html',
    typeLabel: 'Service',
  }, {
    type: 'document',
    title: 'Berufe der Grundbildung',
    teaserText: 'RRB Nr.  258 | 21.03.2019 | Direktion',
    link: 'http://search.zh.ch/xyu',
    typeLabel: 'Dokument',
  }],
  resultsData: {
    numberOfResultPages: 123,
    numberOfResults: 1000,
    resultsByType: [{
      type: 'contentpage',
      numberOfResultPages: 9,
      numberOfResults: 105,
      typeLabel: 'Inhaltsseiten',
    }, {
      type: 'service',
      numberOfResultPages: 2,
      numberOfResults: 32,
      typeLabel: 'Services',
    }, {
      type: 'news',
      numberOfResultPages: 3,
      numberOfResults: 42,
      typeLabel: 'News',
    }, {
      type: 'document',
      numberOfResultPages: 1,
      numberOfResults: 8,
      typeLabel: 'Dokumente',
    }],
  },
  autoCorrectedTerm: 'Zürich',
};

module.exports = data;
