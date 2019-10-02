const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const contextMenuItemDef = require('../../atoms/context_menu_item/context_menu_item.data').variants.default.props;
const contextMenuItemDownload = require('../../atoms/context_menu_item/context_menu_item.data').variants.download.props;

const template = dataHelper.getFileContent('context_menu.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'ContextMenu',
    className: 'ContextMenu',
    jira: 'CZHDEV-*',
    documentation: dataHelper.getDocumentation('context_menu.md'),
    label: 'Navigation',
  },
  props: {
    lists: [
      {
        items: [
          _.merge({}, contextMenuItemDef, { text: 'Menupunkt 1' }),
          _.merge({}, contextMenuItemDef, { text: 'Menupunkt 2' }),
          _.merge({}, contextMenuItemDef, { text: 'Menupunkt 3' }),
        ],
      },
    ],
  },
});

data.colorVariations = []; // no color variations available

const variants = _.mapValues({
  default: {
    meta: {
      title: 'Standard',
      desc: 'Standard Kontextmenü',
    },
  },
  download: {
    meta: {
      title: 'Download Kontextmenü',
      desc: 'Kontextmenü welches erscheint bei einem Download mit mehreren Sprachen',
    },
    props: {
      lists: [
        {
          items: [
            _.merge({}, contextMenuItemDownload, { text: 'Deutsch' }),
            _.merge({}, contextMenuItemDownload, { text: 'Français' }),
            _.merge({}, contextMenuItemDownload, { text: 'Italiano' }),
          ],
        },
      ],
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
