const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const formData = require('../form/form.data.js');
const tableData = require('../table/table.data');
const modalData = require('../modal/modal.data.js');
const tocList = require('../toc_list/toc_list.data.js');
const defButtonData = require('../../atoms/button/button.data.js');

const template = dataHelper.getFileContent('edirectory.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Behördenverzeichnis',
    className: 'Edirectory',
    jira: 'CZHDEV-4459',
    label: 'Komplex',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    defaultColorVariation: 'cv-darkblue',
    dataSource: '/mocks/modules/edirectory/edirectory.json',
    modal: modalData.variants.eDirectory.props,
  },
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Default',
        desc: 'Default implementation',
      },
      props: {
        hasSpinner: true,
        noDataMessage: 'Es gab leider einen Fehler. Bitte versuchen Sie es erneut.',
        form: formData.variants.eDirectory.props,
        table: tableData.variants.eDirectoryResultsSpa.props,
        modal: modalData.variants.eDirectory.props,
        tocList: tocList.variants.eDirectory.props,
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
