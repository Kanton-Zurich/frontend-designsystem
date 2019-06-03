const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const dataRichtext = require('../richtext/richtext.data');
const dataLinklist = require('../linklist/linklist.data');
const imageFigureData = require('../image_figure/image_figure.data');

const template = dataHelper.getFileContent('texthighlight.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Infobox',
    className: 'TextHighlight',
    jira: 'CZHDEV-117',
    documentation: dataHelper.getDocumentation('texthighlight.md'),
  },
  props: {
  },
});

const variants = _.mapValues({
  text: {
    meta: {
      title: 'Text',
      desc: '',
    },
    props: _.merge({
      textVariation: true,
      texthighlightId: _.uniqueId('texthighlight'),
    }, dataRichtext.props),
  },
  linklist: {
    meta: {
      title: 'Linkliste',
      desc: '',
    },
    props: _.merge(dataLinklist.props, {
      linklistVariation: true,
      texthighlightId: _.uniqueId('texthighlight'),
    }),
  },
  image: {
    meta: {
      title: 'Bild',
      desc: '',
    },
    props: _.merge(imageFigureData.props, {
      imageVariation: true,
      texthighlightId: _.uniqueId('texthighlight'),
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
