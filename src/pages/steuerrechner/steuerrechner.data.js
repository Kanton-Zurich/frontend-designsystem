const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const dataHelper = require('@unic/estatico-data');
const headerData = require('../../modules/header/header.data').props;
const taxCalcData = require('../../modules/tax_calc/tax_calc.data').props;
const defFooterData = require('../../modules/footer/footer.data').variants.default.props;
const contextMenuProps = require('../../modules/context_menu/context_menu.data').props;
const contextMenuItemDef = require('../../atoms/context_menu_item/context_menu_item.data').variants.default.props;

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Steuerrechner',
    jira: 'CZHDEV-1238',
    content: dataHelper.getFileContent('steuerrechner.hbs'),
    documentation: dataHelper.getDocumentation('steuerrechner.md'),
  },
  props: {
    header: headerData,
    title: 'Steuerrechner',
    text: '',
    defaultColorVariation: 'cv-turqoise',
    modules: {
      pageHeader: {
        pageTitle: 'Steuerbetrag berechnen',
        inverted: true,
        hasImageTitle: false,
        hasVideo: false,
        hasImage: false,
        hasBacklink: false,
        noButton: true,
        breadcrumb: {
          contextMenu: _.merge({}, contextMenuProps, {
            lists: [
              {
                items: [
                  _.merge({}, contextMenuItemDef, { text: 'Kanton Zürich', iconAfter: false, iconBefore: false }),
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
              title: 'Steuerrechner',
              href: '#',
            },
          ],
        },
      },
      tax_calc: taxCalcData,
      footerData: defFooterData,
    },
  },
});

module.exports = data;
