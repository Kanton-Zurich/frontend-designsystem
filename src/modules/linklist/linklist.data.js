const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const formInputData = require('../../atoms/form_input/form_input.data.js');
const pagination = require('../../modules/pagination/pagination.data.js');
const defButtonData = require('../../atoms/button/button.data.js');

const template = dataHelper.getFileContent('linklist.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Link-Liste',
    className: 'Linklist',
    jira: 'CZHDEV-187',
    label: 'Liste',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    headingLevel: 2,
    visualHeadingLevel: 2,
    links: [
      {
        linkListItemTitle: 'Link 1',
        linkListItemHref: '/',
      },
      {
        linkListItemTitle: 'Link 2',
        linkListItemHref: 'https://www.google.ch',
        target: 'blank',
      },
      {
        linkListItemTitle: 'Link 3',
        linkListItemHref: '/index.html',
      },
    ],
  },
});

const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Mit H2',
        desc: 'Implementation mit H2-Überschrift',
      },
      props: {
        linkListTitle: 'Linkliste',
        headingLevel: 2,
        visualHeadingLevel: 2,
      },
    },
    h3: {
      meta: {
        title: 'Mit H3',
        desc: 'Implementation mit H3-Überschrift',
      },
      props: {
        linkListTitle: 'Linkliste',
        headingLevel: 3,
        visualHeadingLevel: 3,
      },
    },
    h4: {
      meta: {
        title: 'Mit H4',
        desc: 'Implementation mit H4-Überschrift',
      },
      props: {
        linkListTitle: 'Linkliste',
        headingLevel: 4,
        visualHeadingLevel: 4,
      },
    },
    noTitle: {
      meta: {
        title: 'Ohne Titel, ohne Abstand unten',
        desc: 'Implementation ohne Überschrift',
      },
    },
    noTitleLast: {
      meta: {
        title: 'Ohne Titel, grosser Abstand unten',
        desc: 'Spezielle Klasse für den letzen Eintrag',
      },
      props: {
        isLast: true,
      },
    },
    noTitleAlt: {
      meta: {
        title: 'Ohne Titel, kleiner Abstand unten',
        desc: 'Spezielle Klasse für den letzen Eintrag, Alternative',
      },
      props: {
        smallMargin: true,
        links: [
          {
            linkListItemTitle: 'Gesetz über das Bürgerrecht',
            linkListItemHref: '/',
          },
          {
            linkListItemTitle: 'Gesetz über die Auslagerung von Informatikdienstleistungen',
            linkListItemHref: '/',
          },
          {
            linkListItemTitle:
              'Gesetz über das Schlichtungsverfahren für Streitigkeiten nach Gleichstellungsgesetz in öffentlich-rechtlichen Arbeitsverhältnissen',
            linkListItemHref: '/',
          },
          {
            linkListItemTitle:
              'Gesetz über die Verselbstständigung der Versicherungskasse für das Staatspersonal',
            linkListItemHref: '/',
          },
        ],
      },
    },
    locations: {
      meta: {
        title: 'Mit Standorten',
        desc: 'Diese Variante wird im Standorte-Modul verwendent',
      },
      props: {
        hasIndex: true,
        links: [
          {
            linkListItemIsLocation: true,
            linkListItemDistance: '2,0 km',
            linkListItemTitle: 'Strassenverkehrsamt Kanton Zürich',
            linkListItemLabel: 'Uetlibergstrasse 301, 8036 Zürich',
            linkListItemHref: '/',
          },
          {
            linkListItemIsLocation: true,
            linkListItemDistance: '6,4 km',
            linkListItemTitle: 'Strassenverkehrsamt Bassersdorf',
            linkListItemLabel: 'Grindelstrasse 22, 8303 Bassersdorf',
            linkListItemHref: '/',
          },
          {
            linkListItemIsLocation: true,
            linkListItemDistance: '6,7 km',
            linkListItemTitle: 'Strassenverkehrsamt Kanton Zürich - Prüfstelle Regensdorf',
            linkListItemLabel: 'Riedthofstrasse 192, 8105 Regensdorf',
            linkListItemHref: '/',
          },
          {
            linkListItemIsLocation: true,
            linkListItemDistance: '7,5 km',
            linkListItemTitle: 'Strassenverkehrsamt Kanton Zürich',
            linkListItemLabel: 'Taggenbergstrasse 1, 8408 Winterthur',
            linkListItemHref: '/',
          },
          {
            linkListItemIsLocation: true,
            linkListItemDistance: '17,4 km',
            linkListItemTitle: 'Strassenverkehrsamt Kanton Zürich - Prüfstelle Bülach',
            linkListItemLabel: 'Schützenmatt Strasse 120, 8180 Bülach',
            linkListItemHref: '/',
          },
          {
            linkListItemIsLocation: true,
            linkListItemDistance: '21,9 km',
            linkListItemTitle: 'Strassenverkehrsamt Kanton Zürich - Schifffahrtskontrolle',
            linkListItemLabel: 'Seestrasse 87, 8942 Oberrieden',
            linkListItemHref: '/',
          },
        ],
      },
    },
    numberedTOCSubheading: {
      meta: {
        title: 'Nummeriertes Inhaltsverzeichnis, Zwischenüberschrift nicht verlinkt',
        desc: 'Eingesetzt beim Sozialhilfehandbuch (CZHDEV-3005), kein Titel der Linkliste',
      },
      props: {
        isTOC: true,
        linkListTitle: false,
        links: [
          {
            linkListItemIsTOC: true,
            linkListItemIsTOCHeading: true,
            linkListItemChapterNumber: '2.1',
            linkListItemTitle: 'Unterkapitelüberschrift Aufgaben der Gemeinde',
            linkListItemHref: false,
          },
          {
            linkListItemIsTOC: true,
            linkListItemChapterNumber: '2.1.01',
            linkListItemTitle: 'Aufgaben der Sozialbehörde',
            linkListItemHref: '/',
          },
          {
            linkListItemIsTOC: true,
            linkListItemChapterNumber: '2.1.02',
            linkListItemTitle: 'Organisation der Sozialbehörde',
            linkListItemHref: '/',
          },
          {
            linkListItemIsTOC: true,
            linkListItemChapterNumber: '2.1.03',
            linkListItemTitle: 'Organisation generell',
            linkListItemHref: '/pages/zhlex_detail/zhlex_detail.html',
          },
        ],
      },
    },
    numberedTOCLinkedSubheading: {
      meta: {
        title: 'Nummeriertes Inhaltsverzeichnis, Zwischenüberschrift verlinkt',
        desc: 'Eingesetzt beim Sozialhilfehandbuch (CZHDEV-3005)',
      },
      props: {
        isTOC: true,
        linkListTitle: 'Kapitelüberschrift Aufgabenteilung',
        linkListChapterNumber: '2',
        headingLevel: 3,
        visualHeadingLevel: 3,
        links: [
          {
            linkListItemIsTOC: true,
            linkListItemIsTOCHeading: true,
            linkListItemChapterNumber: '2.1',
            linkListItemTitle: 'Unterkapielüberschrift Aufgaben der Gemeinde verlinkt',
            linkListItemHref: '/',
          },
          {
            linkListItemIsTOC: true,
            linkListItemChapterNumber: '2.1.01',
            linkListItemTitle: 'Aufgaben der Sozialbehörde',
            linkListItemHref: '/',
          },
          {
            linkListItemIsTOC: true,
            linkListItemChapterNumber: '2.1.02',
            linkListItemTitle: 'Organisation der Sozialbehörde',
            linkListItemHref: '/',
          },
          {
            linkListItemIsTOC: true,
            linkListItemChapterNumber: '2.1.03',
            linkListItemTitle: 'Organisation generell',
            linkListItemHref: '/pages/zhlex_detail/zhlex_detail.html',
          },
        ],
      },
    },
    unnumberedTOCSubheading: {
      meta: {
        title: 'Unnummeriertes Inhaltsverzeichnis, Zwischenüberschrift nicht verlinkt',
        desc: 'Allgemeines Inhaltsverzeichnis (CZHDEV-3178)',
      },
      props: {
        isTOC: true,
        linkListTitle: 'Kapitelüberschrift Aufgabenteilung',
        headingLevel: 3,
        visualHeadingLevel: 3,
        links: [
          {
            linkListItemIsTOC: true,
            linkListItemIsTOCHeading: true,
            linkListItemTitle: 'Unterkapitelüberschrift Aufgaben der Gemeinde',
            linkListItemHref: false,
          },
          {
            linkListItemIsTOC: true,
            linkListItemTitle: 'Aufgaben der Sozialbehörde',
            linkListItemHref: '/',
          },
          {
            linkListItemIsTOC: true,
            linkListItemTitle: 'Organisation der Sozialbehörde',
            linkListItemHref: '/',
          },
          {
            linkListItemIsTOC: true,
            linkListItemTitle: 'Organisation generell',
            linkListItemHref: '/pages/zhlex_detail/zhlex_detail.html',
          },
        ],
      },
    },
    unnumberedTOCLinkedSubheading: {
      meta: {
        title: 'Unnummeriertes Inhaltsverzeichnis, Zwischenüberschrift verlinkt',
        desc: 'Allgemeines Inhaltsverzeichnis (CZHDEV-3178)',
      },
      props: {
        isTOC: true,
        linkListTitle: 'Kapitelüberschrift Aufgabenteilung',
        headingLevel: 3,
        visualHeadingLevel: 3,
        links: [
          {
            linkListItemIsTOC: true,
            linkListItemIsTOCHeading: true,
            linkListItemTitle: 'Unterkapitelüberschrift Aufgaben der Gemeinde verlinkt',
            linkListItemHref: '/',
          },
          {
            linkListItemIsTOC: true,
            linkListItemTitle: 'Aufgaben der Sozialbehörde',
            linkListItemHref: '/',
          },
          {
            linkListItemIsTOC: true,
            linkListItemTitle: 'Organisation der Sozialbehörde',
            linkListItemHref: '/',
          },
          {
            linkListItemIsTOC: true,
            linkListItemTitle: 'Organisation generell',
            linkListItemHref: '/pages/zhlex_detail/zhlex_detail.html',
          },
        ],
      },
    },
    eDirectoryAccordion: {
      meta: {
        title: 'Behördenverzeichnis Akkordeon',
        desc: 'Behördenverzeichnis',
      },
      props: {
        linkListTitle: false,
        links: [
          {
            linkListItemTitle: 'Geschäftsleitung des Kantonsrats',
            linkListItemHref: '#',
            linkListItemIsEDirectory: true,
          },
          {
            linkListItemTitle: 'Parlamentsdienste',
            linkListItemHref: '#',
            linkListItemIsEDirectory: true,
          },
          {
            linkListItemTitle: 'Ombudsstelle',
            linkListItemHref: '#',
            linkListItemIsEDirectory: true,
          },
        ],
      },
    },
    eDirectorySpa: {
      meta: {
        title: 'Behördenverzeichnis SPA',
        desc: 'Behördenverzeichnis SPA',
      },
      props: {
        linkListTitle: 'placeholder (can be empty)',
        headingLevel: 2,
        visualHeadingLevel: 3,
        spa: true,
        titleNoMarginTop: true,
        hasFilter: true,
        hasGroups: true,
        links: false,
        searchInput: _.merge({}, formInputData.variants.clearButtonSmallWithIcon.props, {
          label: 'Liste durchsuchen',
        }),
        placeholder: {
          title: 'Keine Ergebnisse gefunden.',
          text: 'Versuchen Sie es mit einer anderen Eingabe oder überprüfen Sie die Schreibweise.',
          additionalClasses: 'mdl-edirectory__placeholder',
          button: _.merge({}, defButtonData.variants.secondaryWithIcon.props, {
            text: 'Suche zurücksetzen',
            icon: 'undo',
          }),
        },
        pagination: _.merge({}, pagination.variants.default.props, {}),
      },
    },
    financeReportSpa: {
      meta: {
        title: 'Leistungsgruppensuche KEF SPA',
        desc: 'für Konsolidierten Entwicklungs- und Finanzbericht',
      },
      props: {
        linkListTitle: 'Berichte der Direktionen und der Staatskanzlei',
        headingLevel: 2,
        visualHeadingLevel: 2,
        hasFilter: true,
        titleNoMarginTop: true,
        description:
          'Die sieben Direktionen und die Staatskanzlei geben Rechenschaft darüber ab, was sie im vergangenen Geschäftsjahr Wesentliches geleistet haben. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
        links: [
          {
            useContentTeaser: true,
            shortTitle: '1 Staatskanzlei',
            target: '#',
            additionalAttributes: `data-page-title="absichtlich nicht der gleich inhalt wie der shorttitle"
            data-synonyms="['Regierungskanzlei', 'Kanzlei des Regierungsrats', 'Zentrale Verwaltung']"`,
          },
          {
            useContentTeaser: true,
            shortTitle: '2 Direktion der Justiz und des Innern',
            target: '#',
            additionalAttributes: `data-page-title="Direktion der Justiz und des Innern"
            data-synonyms="['Abwicklung Investitionsfonds (2217)', 'Bezirksräte (2251)', 'Fachstelle Gleichstellung (2233)', 'Fachstelle Integration (2241)', 'Fachstelle Kultur (2234)', 'Gemeindeamt (2207)', 'Generalsekretariat (2201)', 'Handelsregisteramt (2221)', 'Jugendstrafrechtspflege (2205)', 'Justizvollzug und Wiedereingliederung (2206)', 'Kantonale Opferhilfestelle (2232)', 'Kantonaler Finanzausgleich (2216)', 'Kulturfonds (2934)', 'Religionsgemeinschaften (2270)', 'Staatsanwaltschaft (2204)', 'Staatsarchiv (2224)', 'Statistisches Amt (2223)', 'Statthalterämter (2261)']"`,
          },
          {
            useContentTeaser: true,
            shortTitle: '3 Sicherheitsdirektion',
            target: '#',
            additionalAttributes: `data-page-title="Sicherheitsdirektion"
            data-synonyms="['Polizeidirektion', 'Sicherheitsamt', 'Direktion für öffentliche Sicherheit']"`,
          },
          {
            useContentTeaser: true,
            shortTitle: '4 Finanzdirektion',
            target: '#',
            additionalAttributes: `data-page-title="Finanzdirektion"
            data-synonyms="['Generalsekretariat (4000)', 'Finanzverwaltung (4100)', 'Steuern Betriebsteil (4400)', 'Personalamt (4500)', 'Amt für Informatik (4610)', 'IKT-Sicherheitsbeauftragter (4620)', 'Drucksachen und Material (4700)', 'Steuererträge (4910)', 'Schadenausgleich (4921)', 'Zinsen und Beteiligungen (4930)', 'Sammelpositionen (4950)', 'Nationaler Finanzausgleich (4960)', 'Gemeinnütziger Fonds (4980)']"`,
          },
          {
            useContentTeaser: true,
            shortTitle: '5 Volkswirtschaftsdirektion',
            target: '#',
            additionalAttributes: `data-page-title="Volkswirtschaftsdirektion"
            data-synonyms="['Wirtschaftsdirektion', 'Amt für Wirtschaft', 'Direktion für Wirtschaft und Arbeit']"`,
          },
          {
            useContentTeaser: true,
            shortTitle: '6 Gesundheitsdirektion',
            target: '#',
            additionalAttributes: `data-page-title="Gesundheitsdirektion"
            data-synonyms="['Gesundheitsamt', 'Direktion für Gesundheit und Soziales', 'Kantonales Gesundheitswesen']"`,
          },
          {
            useContentTeaser: true,
            shortTitle: '7 Bildungsdirektion',
            linkListItemHref: '#',
            additionalAttributes: `data-page-title="Bildungsdirektion"
            data-synonyms="['Erziehungsdirektion', 'Schulamt', 'Direktion für Bildung und Kultur', 'Bildungswesen']"`,
          },
          {
            useContentTeaser: true,
            shortTitle: '8 Baudirektion',
            target: '#',
            additionalAttributes: `data-page-title="Baudirektion"
            data-synonyms="['Baudepartement', 'Amt für Raumplanung', 'Direktion für Bau und Verkehr', 'Infrastrukturdirektion']"`,
          },
          {
            useContentTeaser: true,
            shortTitle: '9 Behörden, Rechtspflege, zu konsolidierende Organisationen',
            target: '#',
            additionalAttributes: `data-page-title="Behörden, Rechtspflege, zu konsolidierende Organisationen"
            data-synonyms="['Justizbehörden', 'Gerichte', 'Staatsanwaltschaft', 'Verwaltungsorgane']"`,
          },
        ],
        searchInput: _.merge({}, formInputData.variants.clearButtonSmallWithIcon.props, {
          label: 'Nach Leistungsgruppe suchen',
        }),
        placeholder: {
          title: 'Keine Ergebnisse gefunden.',
          text: 'Versuchen Sie es mit einer anderen Eingabe oder überprüfen Sie die Schreibweise.',
          button: _.merge({}, defButtonData.variants.secondaryWithIcon.props, {
            text: 'Suche zurücksetzen',
            icon: 'undo',
          }),
        },
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
          data: dataHelper.getFormattedJson(variantProps),
          html: dataHelper.getFormattedHtml(compiledVariant()),
        },
      },
    });

    return variantData;
  }
);

data.variants = variants;

module.exports = data;
