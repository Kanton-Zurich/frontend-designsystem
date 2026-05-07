const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');

const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js').variants.noToc.props;
const headerData = require('../../modules/header/header.data').variants.invertedWithUserLoggedOut
  .props;
const defPageHeaderData = require('../../modules/page_header/page_header.data').variants.office
  .props;

const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const backToData = require('../../modules/back_to/back_to.data').variants.default.props;
const defLangSwitchData = require('../../modules/lang_switch/lang_switch.data').variants.active
  .props;
const defRichtextData = require('../../modules/richtext/richtext.data').variants.default.props;
const defTeaserData = require('../../modules/teaser/teaser.data').variants.easyLanguage.props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Leichter Sprache',
    jira: 'CZHDEV-1234',
    content: dataHelper.getFileContent('easy_language.hbs'),
  },
  props: {
    title: 'Leichte Sprache',
    skiplinks: skiplinksData,
    header: headerData,
    defaultColorVariation: 'cv-darkblue',
    modules: {
      pageHeaderData: _.merge({}, defPageHeaderData, {
        pageTitle: 'Leichte Sprache',
        inverted: true,
        buttonData: false,
      }),
      leadSectionData: {
        leadText: 'Die Leichte Sprache ist eine Sprache, die leichter zu verstehen ist.',
      },
      richtextData: defRichtextData,
      teaserData: defTeaserData,
      footerData: defFooterData,
      backToData,
      langSwitchData: Object.assign({}, defLangSwitchData, {
        easyLanguage: true,
      }),
    },
  },
});

module.exports = data;
