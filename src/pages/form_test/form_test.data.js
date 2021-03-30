const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.noToc.props;
const headerData = require('../../modules/header/header.data').variants.inverted.props;

const defPageHeaderData = require('../../modules/page_header/page_header.data.js');
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const defFormData = require('../../modules/form/form.data').variants;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Form Test',
    jira: 'CZHDEV-',
    content: dataHelper.getFileContent('form_test.hbs'),
    documentation: dataHelper.getDocumentation('form_test.md'),
  },
  props: {
    header: headerData,
    skiplinks: skiplinksData,
    modules: {
      pageHeaderData: _.merge({}, defPageHeaderData.variants.rrbDetail.props, {
        pageTitle: 'Form Test',
        breadcrumb: {
          path: [{
            title: 'Zurück zur Übersicht',
            href: '#',
          }],
        },
      }),
      formSection1: defFormData.simpleMultiUpload.props,
      formSection2: defFormData.duplicationUpload.props,
      footerData: defFooterData,
    },
  },
});

module.exports = data;
