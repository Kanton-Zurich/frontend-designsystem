const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defFormData = require('../form/form.data');
const defPaginationData = require('../pagination/pagination.data');

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
      resultCountTitle: '%1 Treffer zu ihrer Abfrage',
      flexFormData: _.merge({}, defFormData.variants.steuerBuch.props),
      resultsTemplate: templateConverter('<a href="{{link}}" class="atm-text_link">{{text}}</a>', false),
      tableData: {
        tableTitle: '',
        hasTitle: true,
        tableHeadingLevel: 4,
        hasColumnHeader: true,
        isWide: true,
        isStatic: true,
        preSortedColumn: 'zstb-nummer',
        preSortedDirection: 'asc',
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
  zhlex: {
    meta: {
      title: 'ZH-Lex',
      desc: 'Zürcher Gesetzessammlung',
    },
    props: {
      pagination: defPaginationData.variants.fullWidth.props,
      resultCountTitle: '%1 Treffer zu ihrer Abfrage',
      flexFormData: _.merge({}, defFormData.variants.zhlex.props),
      resultsTemplate: templateConverter('<a href="{{link}}" class="atm-text_link">{{text}}</a>', false),
      tableData: {
        tableTitle: '',
        hasTitle: true,
        tableHeadingLevel: 4,
        hasColumnHeader: true,
        isWide: true,
        isStatic: true,
        preSortedColumn: 'ordnungsnummer',
        preSortedDirection: 'asc',
        headers: [
          {
            title: 'Ordnungsnummer',
            dataColumnName: 'ordnungsnummer',
            isSortable: 'alpha',
          },
          {
            title: 'Erlasstitel',
            dataColumnName: 'erlasstitel',
            isSortable: 'alpha',
          },
          {
            title: 'Erlassdatum',
            dataColumnName: 'erlassdatum',
            isSortable: 'date',
          },
        ],
        bodyrows: [],
      },
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
