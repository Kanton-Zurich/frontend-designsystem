/* eslint-disable prettier/prettier */
const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('search_result_list.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Suchergebnisse Liste',
    className: 'SearchResultList',
    jira: 'CZHDEV-4746',
    label: 'Suche',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    type: 'contentpage',
    title: 'Inhaltsseiten',
    results: JSON.stringify({
      results: [{
        type: 'news',
        typeLabel: 'News',
        date: '14.12.2018',
        title: 'Zürcher Längsschnittstudie',
        teaserText: 'Falls Sie einen ausländischen Führerausweis besitzen und in der Schweiz wohnen.',
        link: 'http://search.zh.ch/xyl',
        publicationType: 'Medienmitteilung',
        isTopResult: true,
      }, {
        type: "contentpage",
        typeLabel: "Inhaltsseiten",
        title: "Internationaler Führerausweis",
        teaserText: "In nicht englischsprachigen Ländern ausserhalb der <span class=\"highlight\">EU</span> empfehlen wir Ihnen, einen internationalen Führerschein ausstellen zu lassen.",
        breadcrumb: "Mobilität ‣ Führerausweis ‣ Internationaler Führerausweis",
        link: "http://search.zh.ch/xyz"
      }, {
        type: "service",
        typeLabel: "Services",
        title: "Internationalen Führerschein beantragen",
        teaserText: "In nicht englischsprachigen Ländern ausserhalb der EU empfehlen wir Ihnen, einen internationalen Führerschein ausstellen zu lassen.",
        link: "http://search.zh.ch/xyi"
      }, {
        type: "document",
        typeLabel: "Dokumente",
        title: "Berufe der Grundbildung",
        metadata: [
          {
            term: 'Grösse',
            description: '12kB',
          },
          {
            term: 'Datum',
            description: '21.12.2023',
          },
          {
            term: 'Format',
            description: 'CSV',
          },
          {
            term: 'Sprache',
            description: 'Deutsch',
          },
        ],
        link: "http://search.zh.ch/xyu"
      }, {
        type: "person",
        typeLabel: "Personen",
        title: "Roger Zedi",
        role: "Product Owner",
        email: "roger.zedi@zh.ch",
        phone: {
          title: "043 258 48 92",
          link: "tel:0432584892"
        },
        teaserText: "XYZ",
        link: "http://search.zh.ch/xyu"
      }],
      resultsData: {
        numberOfResultPages: 11,
        numberOfResults: 105,
        queryId: "awef123",
        resultsByType: [{
          type: "contentpage",
          numberOfResults: 105
        }, {
          type: "service",
          numberOfResults: 32
        }, {
          type: "news",
          numberOfResults: 42
        }, {
          type: "document",
          numberOfResults: 8
        }, {
          type: "people",
          numberOfResults: 2
        }]
      },
      didYouMean: ["Schule", "Scuol", "Schuhe"],
      similarTerms: ["Schulferien Kalender", "Schulzulassungprüfung", "Schulpflege"],
      autoCorrectedTerm: "Zürich"
    }),
  },
});

const variants = _.mapValues(
  {
    contentpage: {
      meta: {
        title: 'Content Pages',
        desc: 'Shows only content page search results',
      },
      props: {
        paginationData: {
          headingLevel: 3,
          inputId: 'contentpage_pagination_input',
          descriptionId: 'contentpage_pagination_description',
        },
        results: JSON.stringify({
          results: [
            {
              type: 'news',
              typeLabel: 'News',
              date: '14.12.2018',
              title: 'Zürcher Längsschnittstudie',
              teaserText:
                'Falls Sie einen ausländischen Führerausweis besitzen und in der Schweiz wohnen.',
              link: 'http://search.zh.ch/xyl',
              publicationType: 'Medienmitteilung',
              isTopResult: true,
            },
            {
              type: 'contentpage',
              typeLabel: 'Inhaltsseite',
              title: 'Internationaler Führerausweis',
              teaserText:
                'In nicht englischsprachigen Ländern ausserhalb der EU emp<mark class="searchhighlight">fehlen</mark> wir Ihnen, einen internationalen Führerschein ausstellen zu lassen.',
              breadcrumb: 'Strassenverkehrsamt ‣ Führerausweis ‣ Internationaler Führerausweis',
              link: 'http://search.zh.ch/xyz',
            },
            {
              type: 'contentpage',
              typeLabel: 'Inhaltsseite',
              title: 'Führerausweis beantragen',
              teaserText:
                'Hier finden Sie alle Informationen zum <mark class="searchhighlight">Beantragen</mark> eines Führerausweises in der Schweiz.',
              breadcrumb: 'Strassenverkehrsamt ‣ Führerausweis ‣ Beantragen',
              link: 'http://search.zh.ch/contentpage-2',
            },
            {
              type: 'contentpage',
              typeLabel: 'Inhaltsseite',
              title: 'Verkehrsregeln und Gesetze',
              teaserText:
                'Übersicht über die wichtigsten <mark class="searchhighlight">Verkehrsregeln</mark> und gesetzlichen Bestimmungen.',
              breadcrumb: 'Strassenverkehrsamt ‣ Verkehrsregeln',
              link: 'http://search.zh.ch/contentpage-3',
            },
          ],
          resultsData: {
            numberOfResultPages: 11,
            numberOfResults: 105,
            queryId: 'awef123',
            resultsByType: [
              {
                type: 'contentpage',
                numberOfResults: 105,
              },
              {
                type: 'service',
                numberOfResults: 32,
              },
              {
                type: 'news',
                numberOfResults: 42,
              },
              {
                type: 'document',
                numberOfResults: 8,
              },
              {
                type: 'people',
                numberOfResults: 2,
              },
            ],
          },
          didYouMean: ['Führerschein', 'Fahrerausweis', 'Fahrerlaubnis'],
          similarTerms: [
            'Führerausweis verlängern',
            'Führerausweis umtauschen',
            'Führerausweis Kategorien',
          ],
          autoCorrectedTerm: null,
        }),
      },
    },
    document: {
      meta: {
        title: 'Documents',
        desc: 'Shows only document search results with download functionality',
      },
      props: {
        type: 'document',
        title: 'Dokumente',
        paginationData: {
          headingLevel: 3,
          inputId: 'document_pagination_input',
          descriptionId: 'document_pagination_description',
        },
        results: JSON.stringify({
          results: [
            {
              type: 'document',
              typeLabel: 'Dokument',
              title: 'Preisliste Fischerpatente',
              metadata: [
                {
                  term: 'Grösse',
                  description: '12kB',
                },
                {
                  term: 'Datum',
                  description: '21.12.2023',
                },
                {
                  term: 'Format',
                  description: 'CSV',
                },
                {
                  term: 'Sprache',
                  description: 'Deutsch',
                },
              ],
              link: 'http://search.zh.ch/download/preisliste-fischerpatente.csv',
              icon: 'document-csv',
            },
            {
              type: 'document',
              typeLabel: 'Dokumente',
              title: 'Führerausweis Antragsformular',
              metadata: [
                {
                  term: 'Grösse',
                  description: '245kB',
                },
                {
                  term: 'Datum',
                  description: '15.11.2023',
                },
                {
                  term: 'Format',
                  description: 'PDF',
                },
                {
                  term: 'Sprache',
                  description: 'Deutsch',
                },
              ],
              link: 'http://search.zh.ch/download/fuehrerausweis-antrag.pdf',
              icon: 'document-pdf',
            },
            {
              type: 'document',
              typeLabel: 'Dokument',
              title: 'Verkehrsstatistik Kanton Zürich 2023',
              metadata: [
                {
                  term: 'Grösse',
                  description: '1.2MB',
                },
                {
                  term: 'Datum',
                  description: '30.10.2023',
                },
                {
                  term: 'Format',
                  description: 'XLSX',
                },
                {
                  term: 'Sprache',
                  description: 'Deutsch',
                },
              ],
              link: 'http://search.zh.ch/download/verkehrsstatistik-2023.xlsx',
              icon: 'document-pdf',
            },
          ],
          resultsData: {
            numberOfResultPages: 15,
            numberOfResults: 145,
            queryId: 'document123',
            resultsByType: [
              {
                type: 'document',
                numberOfResults: 145,
              },
            ],
          },
        }),
      },
    },
    news: {
      meta: {
        title: 'News',
        desc: 'Shows only news search results',
      },
      props: {
        type: 'news',
        title: 'News',
        paginationData: {
          headingLevel: 3,
          inputId: 'news_pagination_input',
          descriptionId: 'news_pagination_description',
        },
        results: JSON.stringify({
          results: [
            {
              type: 'news',
              typeLabel: 'News',
              publicationType: 'Medienmitteilung',
              date: '14.12.2022',
              title: 'Prognosezahlen öffentliche Volksschule',
              teaserText:
                'Strassenbau Winterthur- / Überlandstrassen: Bitte planen Sie für Ihre Fahrt zum ' +
                'Strassenverkehrsamt Hinwil genügend Zeit ein',
              link: '#',
            },
            {
              type: 'news',
              typeLabel: 'News',
              publicationType: 'Medienmitteilung',
              date: '14.12.2022',
              title: 'Prognosezahlen öffentliche Volksschule',
              teaserText:
                'Strassenbau Winterthur- / Überlandstrassen: Bitte planen Sie für Ihre Fahrt zum ' +
                'Strassenverkehrsamt Hinwil genügend Zeit ein',
              link: '#',
            },
            {
              type: 'news',
              typeLabel: 'News',
              publicationType: 'Medienmitteilung',
              publicationDate: '14.12.2022',
              title: 'Prognosezahlen öffentliche Volksschule',
              teaserText:
                'Strassenbau Winterthur- / Überlandstrassen: Bitte planen Sie für Ihre Fahrt zum ' +
                'Strassenverkehrsamt Hinwil genügend Zeit ein',
              link: '#',
            },
          ],
          resultsData: {
            numberOfResultPages: 10,
            numberOfResults: 95,
            queryId: 'news123',
            resultsByType: [
              {
                type: 'news',
                numberOfResults: 95,
              },
            ],
          },
          autoCorrectedTerm: null,
        }),
      },
    },
    service: {
      meta: {
        title: 'Services',
        desc: 'Shows only service search results with modal functionality',
      },
      props: {
        type: 'service',
        title: 'Services',
        paginationData: {
          headingLevel: 3,
          inputId: 'service_pagination_input',
          descriptionId: 'service_pagination_description',
        },
        results: JSON.stringify({
          results: [
            {
              type: 'service',
              typeLabel: 'Services',
              title: 'Internationalen Führerschein beantragen',
              teaserText: 'In nicht englischsprachigen Ländern ausserhalb der EU empfehlen wir Ihnen, einen internationalen Führerschein ausstellen zu lassen. Beantragen Sie diesen einfach online.',
              link: '../../pages/service/service.html',
            },
            {
              type: 'service',
              typeLabel: 'Services',
              title: 'Steuererklärung online einreichen',
              teaserText: 'Reichen Sie Ihre Steuererklärung bequem online ein. Der Service führt Sie Schritt für Schritt durch den Prozess und hilft bei der korrekten Ausfüllung.',
              link: '../../pages/service/service.html',
            },
            {
              type: 'service',
              typeLabel: 'Services',
              title: 'Wohnsitz anmelden',
              teaserText: 'Melden Sie Ihren neuen Wohnsitz einfach und schnell online an. Alle notwendigen Formulare und Informationen finden Sie hier.',
              link: '../../pages/service/service.html',
            },
          ],
          resultsData: {
            numberOfResultPages: 7,
            numberOfResults: 65,
            queryId: 'service123',
            resultsByType: [
              {
                type: 'service',
                numberOfResults: 65,
              },
            ],
          },
          autoCorrectedTerm: null,
        }),
      },
    },
    person: {
      meta: {
        title: 'Persons',
        desc: 'Shows only person search results with contact information',
      },
      props: {
        type: 'person',
        title: 'Personen',
        paginationData: {
          headingLevel: 3,
          inputId: 'person_pagination_input',
          descriptionId: 'person_pagination_description',
        },
        results: JSON.stringify({
          results: [
            {
              type: 'person',
              typeLabel: 'Personen',
              title: 'Carla Mom',
              role: 'Leitende Berufs-, Studien- und Laufbahnberaterin',
              email: 'carla.mom@ajb.zh.ch',
              phone: {
                title: '043 258 48 92',
                link: 'tel:0432584892',
              },
              link: 'http://search.zh.ch/person-1',
            },
            {
              type: 'person',
              typeLabel: 'Personen',
              title: 'Dr. Max Mustermann',
              role: 'Leiter Strassenverkehrsamt',
              email: 'max.mustermann@stva.zh.ch',
              phone: {
                title: '043 259 51 11',
                link: 'tel:0432595111',
              },
              link: 'http://search.zh.ch/person-2',
            },
            {
              type: 'person',
              typeLabel: 'Personen',
              title: 'Anna Meier',
              role: 'Sachbearbeiterin Führerausweis',
              email: 'anna.meier@stva.zh.ch',
              phone: {
                title: '043 259 51 22',
                link: 'tel:0432595122',
              },
              link: 'http://search.zh.ch/person-3',
            },
          ],
          resultsData: {
            numberOfResultPages: 2,
            numberOfResults: 18,
            queryId: 'person123',
            resultsByType: [
              {
                type: 'person',
                numberOfResults: 18,
              },
            ],
          },
          autoCorrectedTerm: null,
        }),
      },
    },
  },
  (variant) => {
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
  }
);

data.variants = variants;

module.exports = data;
