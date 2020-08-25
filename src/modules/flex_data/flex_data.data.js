const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defFormData = require('../form/form.data');
const defPaginationData = require('../pagination/pagination.data');
const defAccordionData = require('../accordion/accordion.data');
const defNotificationData = require('../../modules/notification/notification.data').variants.default.props;
const contextMenuItemDef = require('../../atoms/context_menu_item/context_menu_item.data').variants.default.props;

const templateConverter = require('../../../gulp/helpers/templateConverter');

const template = dataHelper.getFileContent('flex_data.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Flexdaten (Gesetzesbeschlüsse, Steuerbuch)',
    className: 'FlexData',
    jira: 'CZHDEV-1234',
    label: 'Applikation',
    documentation: dataHelper.getDocumentation('flex_data.md'),
  },
  props: {
    notificationData: _.merge({}, defNotificationData, {
      message: 'Beim Laden der Daten ist ein Fehler aufgetreten!',
    }),
    resultCountTitle: '%1 Treffer zu ihrer Anfrage',
    resultCountTitleMore: 'Mehr als %1 Treffer zu ihrer Anfrage',
    noResultsTitle: 'Es wurden keine Ergebnisse gefunden. Bitte passen Sie Ihre Suche an.',
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Steuerbuch',
      desc: 'Default implementation',
    },
    props: {
      flexDataSource: '/mocks/modules/flex_data/flex_data_table.json',
      flexTableFormData: _.merge({}, defFormData.variants.steuerBuch.props),
      tableData: {
        tableTitle: '',
        hasTitle: true,
        tableHeadingLevel: 4,
        hasColumnHeader: true,
        isWide: true,
        isStatic: true,
        preSortedColumn: 'zstb-nummer',
        preSortedDirection: 'ascending',
        headers: [
          {
            title: 'ZStB-Nr.',
            dataColumnName: 'zstb-nummer',
            isSortable: 'enum',
          },
          {
            title: 'Kurztitel',
            dataColumnName: 'titel',
            isSortable: 'alpha',
          },
          {
            title: 'Themenbereich',
            dataColumnName: 'themenbereich',
            isSortable: 'alpha',
          },
        ],
        bodyrows: [],
      },
    },
  },
  zhlex_ls: {
    meta: {
      title: 'ZH-Lex Loseblattsammlung',
      desc: 'Loseblattsammlung der Zürcher Gesetzessammlung',
    },
    props: {
      flexDataSource: '/mocks/modules/flex_data/flex_data_zhlex_ls.json',
      pagination: _.merge({}, defPaginationData.variants.fullWidth.props, {
        additionalClasses: 'hidden',
      }),
      flexTableFormData: _.merge({}, defFormData.variants.zhlex.props),
      extendedFlexFormData: _.merge({}, defAccordionData.variants.zhLexLSExtendedSearch.props),
      resultsTemplate: templateConverter('<a href="{{link}}" class="atm-text_link">{{text}}</a>', false),
      tableData: {
        tableTitle: '',
        hasTitle: true,
        tableHeadingLevel: 4,
        hasColumnHeader: true,
        isWide: true,
        isStatic: true,
        headers: [
          {
            title: 'Ordnungs-Nr.',
            dataColumnName: 'referenceNumber',
          },
          {
            title: 'Erlasstitel',
            dataColumnName: 'enactmentTitle',
          },
          {
            title: 'Erlassdatum',
            dataColumnName: 'enactmentDate',
          },
          {
            title: 'Aufhebungsdatum',
            dataColumnName: 'withdrawalDate',
          },
        ],
        bodyrows: [],
      },
    },
  },
  zhlex_os: {
    meta: {
      title: 'ZH-Lex Offizielle Gesetzessammlung',
      desc: 'Offizielle Gesetzessammlung der Zürcher Gesetzessammlung',
    },
    props: {
      flexDataSource: '/mocks/modules/flex_data/flex_data_zhlex_os.json',
      pagination: defPaginationData.variants.fullWidth.props,
      flexTableFormData: _.merge({}, defFormData.variants.zhlex.props),
      extendedFlexFormData: _.merge({}, defAccordionData.variants.zhLexOSExtendedSearch.props),
      resultsTemplate: templateConverter('<a href="{{link}}" class="atm-text_link">{{text}}</a>', false),
      tableData: {
        tableTitle: '',
        hasTitle: true,
        tableHeadingLevel: 4,
        hasColumnHeader: true,
        isWide: true,
        isStatic: true,
        headers: [
          {
            title: 'Ordnungs-Nr.',
            dataColumnName: 'referenceNumber',
          },
          {
            title: 'Erlasstitel',
            dataColumnName: 'enactmentTitle',
          },
          {
            title: 'Erlassdatum',
            dataColumnName: 'enactmentDate',
          },
          {
            title: 'Inkraftsetzung',
            dataColumnName: 'entryIntoForceDate',
          },
        ],
        bodyrows: [],
      },
    },
  },
  rrb: {
    meta: {
      title: 'Entscheide des Regierungsrats',
      desc: '',
    },
    props: {
      initialLoad: true,
      pagination: defPaginationData.variants.default.props,
      flexDataSource: '/mocks/modules/flex_data/flex_data_generic.json',
      flexGenericFormData: _.merge({}, defFormData.variants.rrb.props),
      sortContextMenu: {
        lists: [
          {
            items: [
              _.merge({}, contextMenuItemDef, { text: 'Relevanz', iconAfter: false, iconBefore: false, additionalAttributes: 'data-sort-column="relevance" data-sort-direction="descending"', isButton: true }),
              _.merge({}, contextMenuItemDef, { text: 'Sitzungsdatum aufsteigend', iconAfter: false, iconBefore: false, additionalAttributes: 'data-sort-column="sessionDate" data-sort-direction="ascending"', isButton: true }),
              _.merge({}, contextMenuItemDef, { text: 'Sitzungsdatum absteigend', iconAfter: false, iconBefore: false, additionalAttributes: 'data-sort-column="sessionDate" data-sort-direction="descending"', isButton: true }),
              _.merge({}, contextMenuItemDef, { text: 'Publikationsdatum aufsteigend', iconAfter: false, iconBefore: false, additionalAttributes: 'data-sort-column="publicationDate" data-sort-direction="ascending"', isButton: true }),
              _.merge({}, contextMenuItemDef, { text: 'Publikationsdatum absteigend', iconAfter: false, iconBefore: false, additionalAttributes: 'data-sort-column="publicationDate" data-sort-direction="descending"', isButton: true }),
            ],
          },
        ],
      },
      genericTemplate: `<ul class="mdl-search_page__list">
        <% _.forEach(data, function(item, index) { %>
          <li class="atm-search_result_item">
            <span class="atm-search_result_item__meta">
              <span class="atm-search_result_item__type">
                <%- item.sessionDate %>
              </span>
            </span>
            <a class="atm-search_result_item__content" href="<%- item.link %>">
              <h4 class="atm-heading">RRB Nr. <%- item.decisionNumber%>/<%- item.year %> <%- item.title %></h4>
              <p><%= item.text %></p>
            </a>
          </li>
          <% }); %>
        </ul>
      `,
    },
  },
}, (variant) => {
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
});

data.variants = variants;

module.exports = data;
