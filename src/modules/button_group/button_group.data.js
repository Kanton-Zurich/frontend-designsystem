const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defaultButtonData = require('../../atoms/button/button.data').variants.default.props;

const template = dataHelper.getFileContent('button_group.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Button Group',
    className: 'ButtonGroup',
    jira: 'CZHDEV-206',
    label: 'UI Element',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    buttons: [
      _.merge({}, defaultButtonData, {
        text: 'Taste 1',
        isSecondary: true,
      }),
      _.merge({}, defaultButtonData, {
        text: 'Taste 2',
        isSecondary: true,
      }),
      _.merge({}, defaultButtonData, {
        text: 'Taste 3',
        isSecondary: true,
      }),
    ],
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Standard',
      desc: 'Normale Darstellung',
    },
  },
  iconsOnly: {
    meta: {
      title: 'Nur Icons',
      desc: 'Die Buttons in der Button Group haben jetzt nur Icons',
    },
    props: {
      buttons: [
        _.merge({}, defaultButtonData, {
          text: 'nach links',
          isSecondary: true,
          isTextVisible: false,
          icon: 'angle_left',
        }),
        _.merge({}, defaultButtonData, {
          text: 'nach unten',
          isSecondary: true,
          isTextVisible: false,
          icon: 'angle_drop_down',
        }),
        _.merge({}, defaultButtonData, {
          text: 'nach rechts',
          isSecondary: true,
          isTextVisible: false,
          icon: 'angle_right',
        }),
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
