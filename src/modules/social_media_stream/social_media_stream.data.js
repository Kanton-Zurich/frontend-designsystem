const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const {handlebars} = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defPostData = require('../social_media_post/social_media_post.data.js');

const template = dataHelper.getFileContent('social_media_stream.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Social Media Stream',
    className: 'SocialMediaStream',
    jira: 'CZHDEV-474',
    documentation: dataHelper.getDocumentation('social_media_stream.md'),
  },
  props: {
    heading: {
      level: 2,
      title: 'Folgen Sie Jacqueline Fehr',
      anchorNavReference: '',
    },
    showMore: 'Mehr anzeigen',
    templates: {
      template: defPostData.meta.code.template,
    },
    posts: [
      defPostData.variants.default.props,
      defPostData.variants.twitter.props,
      defPostData.variants.instagram.props,
    ],
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
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
