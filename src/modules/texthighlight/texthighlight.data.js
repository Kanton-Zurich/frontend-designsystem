const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const {handlebars} = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const dataRichtext = require('../richtext/richtext.data');
const dataLinklist = require('../linklist/linklist.data');

const template = dataHelper.getFileContent('texthighlight.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Infobox',
    className: 'TextHighlight',
    jira: 'CZHDEV-117',
    documentation: dataHelper.getDocumentation('texthighlight.md'),
  },
  props: {}
});

const variants = _.mapValues({
  textblue: {
    meta: {
      title: 'Text Blau',
      desc: '',
    },
    props: _.merge({
      colorVariation: 'blue',
      textVariation: true,
    }, dataRichtext.props),
  },
  textgreen: {
    meta: {
      title: 'Text Grün',
      desc: '',
    },
    props: _.merge({
      colorVariation: 'green',
      textVariation: true,
    }, dataRichtext.props),
  },
  linklistmagenta: {
    meta: {
      title: 'Link-List Magenta',
      desc: '',
    },
    props: _.merge(dataLinklist.props, {
      colorVariation: 'magenta',
      linklistVariation: true,
    }),
  },
}, (variant) => {
  const variantProps = _.merge({}, data, variant).props;
  const compiledVariant = () => handlebars.compile(template)(variantProps);
  const variantData = _.merge({}, data, variant, {
    meta: {
      demo: compiledVariant,

      code: {
        handlebars: dataHelper.getFormattedHandlebars(template),
        data: dataHelper.getFormattedJson(variantProps),
        html: dataHelper.getFormattedHtml(compiledVariant()),
      },
    },
  });

  return variantData;
});

data.variants = variants;

module.exports = data;
