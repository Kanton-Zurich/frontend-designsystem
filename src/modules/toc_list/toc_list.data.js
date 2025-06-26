const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('toc_list.hbs');

const defLinklistData = require('../linklist/linklist.data').variants.numberedTOCLinkedSubheading
  .props;
const defUnnumberedLinklistData = require('../linklist/linklist.data').variants
  .unnumberedTOCLinkedSubheading.props;
const defUnnumberedLinklistData2 = require('../linklist/linklist.data').variants
  .unnumberedTOCSubheading.props;
const eDirectoryLegislative = require('../accordion/accordion.data').variants.eDirectoryLegislative
  .props;
const eDirectoryExecutive = require('../accordion/accordion.data').variants.eDirectoryExecutive
  .props;
const eDirectoryJudiciary = require('../accordion/accordion.data').variants.eDirectoryJudiciary
  .props;

const defLinklistDataSec = {
  headingLevel: 3,
  isTOC: true,
  links: [
    {
      linkListItemIsTOC: true,
      linkListItemIsTOCHeading: true,
      linkListItemChapterNumber: '2.1',
      linkListItemTitle: 'Aufgaben des Bezirkrates',
      linkListItemHref: '/',
    },
    {
      linkListItemIsTOC: true,
      linkListItemChapterNumber: '2.2.01',
      linkListItemTitle: 'Aufsichtstätigkeit des Bezirksrats über die Sozialbehörden',
      linkListItemHref: '/',
    },
    {
      linkListItemIsTOC: true,
      linkListItemChapterNumber: '2.2.02',
      linkListItemTitle: 'Bezirksrat als Rekursinstanz',
      linkListItemHref: '/',
    },
  ],
};

const defLinklistDataThird = {
  headingLevel: 3,
  isTOC: true,
  links: [
    {
      linkListItemIsTOC: true,
      linkListItemIsTOCHeading: true,
      linkListItemChapterNumber: '2.3',
      linkListItemTitle: 'Aufgaben des Kantonalen Sozialamts',
      linkListItemHref: '/',
    },
    {
      linkListItemIsTOC: true,
      linkListItemChapterNumber: '2.3.01',
      linkListItemTitle: 'Überblick über die Aufgaben des Kantonalen Sozialamts',
      linkListItemHref: '/',
    },
    {
      linkListItemIsTOC: true,
      linkListItemChapterNumber: '2.3.02',
      linkListItemTitle: 'Aufgaben Amtsleitung des Kantonalen Sozialamts',
      linkListItemHref: '/',
    },
    {
      linkListItemIsTOC: true,
      linkListItemChapterNumber: '2.3.03',
      linkListItemTitle: 'Aufgaben der Abteilung Öffentliche Sozialhilfe',
      linkListItemHref: '/',
    },
    {
      linkListItemIsTOC: true,
      linkListItemChapterNumber: '2.3.04',
      linkListItemTitle: 'Aufgaben der Abteilung Soziale Einrichtungen',
      linkListItemHref: '/',
    },
    {
      linkListItemIsTOC: true,
      linkListItemChapterNumber: '2.3.05',
      linkListItemTitle: 'Aufgaben der Abteilung Asylkoordination',
      linkListItemHref: '/',
    },
    {
      linkListItemIsTOC: true,
      linkListItemChapterNumber: '2.3.06',
      linkListItemTitle: 'Aufgaben Abteilung Sozialversucherungen',
      linkListItemHref: '/',
    },
    {
      linkListItemIsTOC: true,
      linkListItemChapterNumber: '2.3.03',
      linkListItemTitle: 'Aufgaben Kantonale IV-Betriebe',
      linkListItemHref: '/',
    },
  ],
};

const defLinklistDataFourth = {
  headingLevel: 3,
  isTOC: true,
  links: [
    {
      linkListItemIsTOC: true,
      linkListItemIsTOCHeading: true,
      linkListItemChapterNumber: '2.4',
      linkListItemTitle: 'Aufgaben ausgewählter nicht-staatlicher Organisationen',
      linkListItemHref: '/',
    },
    {
      linkListItemIsTOC: true,
      linkListItemChapterNumber: '2.4.01',
      linkListItemTitle: 'Gesetzgeberische Aufgaben des Bundes Bereich Sozialhilfe',
      linkListItemHref: '/',
    },
    {
      linkListItemIsTOC: true,
      linkListItemChapterNumber: '2.4.02',
      linkListItemTitle:
        'Aufgaben des Fachbereichs Sozialhilfe für Auslandschweizerinnen und Auslandschweizer SAS',
      linkListItemHref: '/',
    },
  ],
};

const defLinklistDataFifth = {
  headingLevel: 3,
  isTOC: true,
  isLast: true,
  links: [
    {
      linkListItemIsTOC: true,
      linkListItemIsTOCHeading: true,
      linkListItemChapterNumber: '2.5',
      linkListItemTitle: 'Aufgaben des Bundes in der Sozialhilfe',
      linkListItemHref: '/',
    },
    {
      linkListItemIsTOC: true,
      linkListItemChapterNumber: '2.5.01',
      linkListItemTitle: 'Sozialkonferenz des Kantons Zürich',
      linkListItemHref: '/',
    },
    {
      linkListItemIsTOC: true,
      linkListItemChapterNumber: '2.5.02',
      linkListItemTitle: 'Aufgaben der Informationsstelle des Zürcher Sozialwesens',
      linkListItemHref: '/',
    },
    {
      linkListItemIsTOC: true,
      linkListItemChapterNumber: '2.5.03',
      linkListItemTitle: 'Aufgaben Schweizerische Konferenz für Sozialhilfe SKOS',
      linkListItemHref: '/',
    },
    {
      linkListItemIsTOC: true,
      linkListItemChapterNumber: '2.5.04',
      linkListItemTitle:
        'Aufgaben der Konferenz der schweizerischen Sozialdirektorinnen und Sozialdirektoren SODK',
      linkListItemHref: '/',
    },
  ],
};

const defUnnumberedLinklistData3 = {
  headingLevel: 3,
  isTOC: true,
  isLast: true,
  links: [
    {
      linkListItemIsTOC: true,
      linkListItemIsTOCHeading: true,
      linkListItemTitle: 'Aufgaben des Bundes in der Sozialhilfe',
    },
    {
      linkListItemIsTOC: true,
      linkListItemTitle: 'Sozialkonferenz des Kantons Zürich',
      linkListItemHref: '/',
    },
    {
      linkListItemIsTOC: true,
      linkListItemTitle: 'Aufgaben der Informationsstelle des Zürcher Sozialwesens',
      linkListItemHref: '/',
    },
    {
      linkListItemIsTOC: true,
      linkListItemTitle: 'Aufgaben Schweizerische Konferenz für Sozialhilfe SKOS',
      linkListItemHref: '/',
    },
    {
      linkListItemIsTOC: true,
      linkListItemTitle:
        'Aufgaben der Konferenz der schweizerischen Sozialdirektorinnen und Sozialdirektoren SODK',
      linkListItemHref: '/',
    },
  ],
};

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Inhaltsverzeichnis',
    className: 'TOCList',
    jira: 'CZHDEV-502',
    label: 'Liste',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    anchorNavReference: 'toc_list',
  },
});

const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Nummeriertes Inhaltsverzeichnis',
        desc: 'Offen dargestellt, nummeriert',
      },
      props: {
        moduleHeader: {
          title: 'Inhalt',
          headingBordered: true,
          wholeTOCHref: '#',
          wholeTOCLabel: 'Gesamtes Inhaltsverzeichnis',
        },
        tocListChapters: [
          defLinklistData,
          defLinklistDataSec,
          defLinklistDataThird,
          defLinklistDataFourth,
          defLinklistDataFifth,
        ],
      },
    },
    unnumbered: {
      meta: {
        title: 'Unnummeriertes Inhaltsverzeichnis',
        desc: 'Offen dargestellt, unnummeriert',
      },
      props: {
        moduleHeader: {
          title: 'Inhalt',
        },
        tocListChapters: [
          defUnnumberedLinklistData,
          defUnnumberedLinklistData2,
          defUnnumberedLinklistData3,
        ],
      },
    },
    eDirectory: {
      meta: {
        title: 'Behördenverzeichnis',
        desc: 'Behördenverzeichnis',
      },
      props: {
        isEDirectory: true,
        moduleHeader: {
          title: 'Behörden',
          headingBordered: true,
        },
        tocListChapters: [eDirectoryLegislative, eDirectoryExecutive, eDirectoryJudiciary],
      },
    },
    eDirectoryError: {
      meta: {
        title: 'Behördenverzeichnis Fehler',
        desc: 'Behördenverzeichnis, wenn keine API zur Verfügung steht.',
      },
      props: {
        isEDirectory: true,
        moduleHeader: {
          title: 'Behörden',
          headingBordered: true,
        },
        placeholder: {
          title: 'Die Inhalte konnten nicht geladen werden.',
          text: 'Momentan sind die Inhalte nicht erreichbar. Versuchen Sie es später noch einmal.',
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
