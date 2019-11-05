const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defFormData = require('../form/form.data');
const defPaginationData = require('../pagination/pagination.data');
const contextMenuItemDef = require('../../atoms/context_menu_item/context_menu_item.data').variants.default.props;

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

  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Steuerbuch',
      desc: 'Default implementation',
    },
    props: {
      pagination: defPaginationData.variants.fullWidth.props,
      flexDataSource: '/mocks/modules/flex_data/flex_data_table.json',
      resultCountTitle: '%1 Treffer zu ihrer Abfrage',
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
  rrb: {
    meta: {
      title: 'Entscheide des Regierungsrats',
      desc: '',
    },
    props: {
      title: 'Suche',
      headingLevel: 2,
      pagination: defPaginationData.variants.fullWidth.props,
      flexDataSource: '/mocks/modules/flex_data/flex_data_generic.json',
      flexGenericFormData: _.merge({}, defFormData.variants.rrb.props),
      resultCountTitle: '%1 Treffer zu ihrer Abfrage',
      sortContextMenu: {
        lists: [
          {
            items: [
              _.merge({}, contextMenuItemDef, { text: 'Relevanz', iconAfter: false, iconBefore: false, additionalAttributes: 'data-sort-column="relevance" data-sort-direction="descending"', isButton: true }),
              _.merge({}, contextMenuItemDef, { text: 'Sitzungsdatum aufsteigend', iconAfter: false, iconBefore: false, additionalAttributes: 'data-sort-column="sessionDate" data-sort-direction="ascending"', isButton: true }),
              _.merge({}, contextMenuItemDef, { text: 'Sitzungsdaatum absteigend', iconAfter: false, iconBefore: false, additionalAttributes: 'data-sort-column="sessionDate" data-sort-direction="desc"', isButton: true }),
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
              <span class="atm_search_result_item__type">
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
