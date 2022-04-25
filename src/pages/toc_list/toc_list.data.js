const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const headerData = require('../../modules/header/header.data').variants.userMenu.props;

const defPageHeaderData = require('../../modules/page_header/page_header.data.js').variants.colored.props;
const contextMenuProps = require('../../modules/context_menu/context_menu.data').props;
const contextMenuItemDef = require('../../atoms/context_menu_item/context_menu_item.data').variants.default.props;

const defLinklistData = require('../../modules/linklist/linklist.data').variants.tableOfContents.props;
const defLinklistDataSec = {
  headingLevel: 2,
  links: [
    {
      linkListItemIsSocialCare: true,
      linkListItemIsSocialCareBold: true,
      linkListItemChapterNumber: '2.1',
      linkListItemTitle: 'Aufgaben des Bezirkrates',
      linkListItemHref: '/',
      isHeading: true,
    },
    {
      linkListItemIsSocialCare: true,
      linkListItemChapterNumber: '2.2.01',
      linkListItemTitle: 'Aufsichtstätigkeit des Bezirksrats über die Sozialbehörden',
      linkListItemHref: '/',
    },
    {
      linkListItemIsSocialCare: true,
      linkListItemChapterNumber: '2.2.02',
      linkListItemTitle: 'Bezirksrat als Rekursinstanz',
      linkListItemHref: '/',
    },
  ],
}
const defLinklistDataThird = {
  headingLevel: 2,
  links: [
    {
      linkListItemIsSocialCare: true,
      linkListItemIsSocialCareBold: true,
      linkListItemChapterNumber: '2.3',
      linkListItemTitle: 'Aufgaben des Kantonalen Sozialamts',
      linkListItemHref: '/',
      isHeading: true,
    },
    {
      linkListItemIsSocialCare: true,
      linkListItemChapterNumber: '2.3.01',
      linkListItemTitle: 'Überblick über die Aufgaben des Kantonalen Sozialamts',
      linkListItemHref: '/',
    },
    {
      linkListItemIsSocialCare: true,
      linkListItemChapterNumber: '2.3.02',
      linkListItemTitle: 'Aufgaben Amtsleitung des Kantonalen Sozialamts',
      linkListItemHref: '/',
    },
    {
      linkListItemIsSocialCare: true,
      linkListItemChapterNumber: '2.3.03',
      linkListItemTitle: 'Aufgaben der Abteilung Öffentliche Sozialhilfe',
      linkListItemHref: '/',
    },
    {
      linkListItemIsSocialCare: true,
      linkListItemChapterNumber: '2.3.04',
      linkListItemTitle: 'Aufgaben der Abteilung Soziale Einrichtungen',
      linkListItemHref: '/',
    },
    {
      linkListItemIsSocialCare: true,
      linkListItemChapterNumber: '2.3.05',
      linkListItemTitle: 'Aufgaben der Abteilung Asylkoordination',
      linkListItemHref: '/',
    },
    {
      linkListItemIsSocialCare: true,
      linkListItemChapterNumber: '2.3.06',
      linkListItemTitle: 'Aufgaben Abteilung Sozialversucherungen',
      linkListItemHref: '/',
    },
    {
      linkListItemIsSocialCare: true,
      linkListItemChapterNumber: '2.3.03',
      linkListItemTitle: 'Aufgaben Kantonale IV-Betriebe',
      linkListItemHref: '/',
    },
  ],
}
const defLinklistDataFourth = {
  headingLevel: 2,
  links: [
    {
      linkListItemIsSocialCare: true,
      linkListItemIsSocialCareBold: true,
      linkListItemChapterNumber: '2.4',
      linkListItemTitle: 'Aufgaben ausgewählter nicht-staatlicher Organisationen',
      linkListItemHref: '/',
      isHeading: true,
    },
    {
      linkListItemIsSocialCare: true,
      linkListItemChapterNumber: '2.4.01',
      linkListItemTitle: 'Gesetzgeberische Aufgaben des Bundes Bereich Sozialhilfe',
      linkListItemHref: '/',
    },
    {
      linkListItemIsSocialCare: true,
      linkListItemChapterNumber: '2.4.02',
      linkListItemTitle: 'Aufgaben des Fachbereichs Sozialhilfe für Auslandschweizerinnen und Auslandschweizer SAS',
      linkListItemHref: '/',
    },
  ],
}
const defLinklistDataFifth = {
  headingLevel: 2,
  links: [
    {
      linkListItemIsSocialCare: true,
      linkListItemIsSocialCareBold: true,
      linkListItemChapterNumber: '2.5',
      linkListItemTitle: 'Aufgaben des Bundes in der Sozialhilfe',
      linkListItemHref: '/',
      isHeading: true,
    },
    {
      linkListItemIsSocialCare: true,
      linkListItemChapterNumber: '2.5.01',
      linkListItemTitle: 'Sozialkonferenz des Kantons Zürich',
      linkListItemHref: '/',
    },
    {
      linkListItemIsSocialCare: true,
      linkListItemChapterNumber: '2.5.02',
      linkListItemTitle: 'Aufgaben der Informationsstelle des Zürcher Sozialwesens',
      linkListItemHref: '/',
    },
    {
      linkListItemIsSocialCare: true,
      linkListItemChapterNumber: '2.5.03',
      linkListItemTitle: 'Aufgaben Schweizerische Konferenz für Sozialhilfe SKOS',
      linkListItemHref: '/',
    },
    {
      linkListItemIsSocialCare: true,
      linkListItemChapterNumber: '2.5.04',
      linkListItemTitle: 'Aufgaben der Konferenz der schweizerischen Sozialdirektorinnen und Sozialdirektoren SODK',
      linkListItemHref: '/',
    },
  ],
}

const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const defBack2TopData = require('../../modules/back2top/back2top.data').variants.default.props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Inhaltsverzeichnis',
    jira: 'CZHDEV-3178',
    content: dataHelper.getFileContent('toc_list.hbs'),
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    header: headerData,
    defaultColorVariation: 'cv-magenta',
    modules: {
      pageHeaderData: _.merge({}, defPageHeaderData, {
        pageTitle: 'Inhaltsverzeichnis',
        inverted: true,
        buttonData: false,
        breadcrumb: {
          contextMenu: _.merge({}, contextMenuProps, {
            lists: [
              {
                items: [
                  _.merge({}, contextMenuItemDef, { text: 'Sicherheitsdirektion', iconAfter: false, iconBefore: false }),
                ],
              },
            ],
          }),
          path: [
            {
              title: 'Kanton Zürich',
              href: '#',
            },
            {
              title: 'Steuern',
              href: '#',
            },
            {
              title: 'Sozialhilfe-Handbuch',
              href: '#',
            },
          ],
        },
        leadText: 'Das Sozialhilfe-Behördenhandbuch enthält Beiträge zum Sozialhilferecht des Kantons Zürich und zum Zuständigkeitsgesetz des Bundes. Daneben gibt es einen Überblick über die Einrichtungen der primären sozialen Sicherheit und zu weiteren sozialrechtlichen Fragen.',
      }),
      linklistData: defLinklistData,
      linklistDataSec: defLinklistDataSec,
      linklistDataThird: defLinklistDataThird,
      linklistDataFourth: defLinklistDataFourth,
      linklistDataFifth: defLinklistDataFifth,
      footerData: defFooterData,
      back2topData: _.merge({}, defBack2TopData, { preserveLangSwitch: true }),
    },
  },
});

module.exports = data;
