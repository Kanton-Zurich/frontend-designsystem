const data = {
  results: [{
    type: 'contentpage',
    title: 'Internationaler Führerausweis',
    teaserText: 'In nicht englischsprachigen Ländern ausserhalb der EU emp<span class="highlight">fehlen</span> wir Ihnen, einen internationalen Führerschein ausstellen zu lassen.',
    breadcrumb: 'Kanton Zürich > Führereausweis > Internationaler Führerausweis',
    link: 'http://search.zh.ch/xyz',
    typeLabel: 'Inhaltsseite',
  }, {
    type: 'news',
    date: '14.12.2018',
    title: 'Zürcher Längsschnittstudie',
    teaserText: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum <span class="highlight">fehlen</span>',
    link: 'http://search.zh.ch/xyl',
    typeLabel: 'News',
  }, {
    type: 'service',
    title: 'Internationalen Führerschein beantragen',
    teaserText: 'In nicht englischsprachigen Ländern ausserhalb der EU emp<span class="highlight">fehlen</span> wir Ihnen, einen internationalen Führerschein ausstellen zu lassen.',
    link: '/modules/service_list/service_page.mock.html',
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
    queryId: 'awef123',
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
    },
    {
      type: 'event',
      numberOfResultPages: 2,
      numberOfResults: 14,
      typeLabel: 'Veranstaltungen',
    }],
  },
  autoCorrectedTerm: 'Zürich',
};

module.exports = data;
