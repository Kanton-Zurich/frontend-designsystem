const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('social_media_links.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Social Media Links',
    className: 'SocialMediaLinks',
    jira: 'CZHDEV-438',
    label: 'Social media',
    documentation: dataHelper.getDocumentation('social_media_links.md'),
  },
  props: {

  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Standard',
      desc: 'Standard-Implementation',
    },
    props: {
      socialMediaLinksHeading: {
        title: 'Folgen Sie uns auf',
        level: 2,
      },
      facebook: {
        url: '#',
        linkText: 'Facebook',
        imgSrc: '../../assets/media/image/facebook.svg',
      },
      twitter: {
        url: '#',
        linkText: 'Twitter',
        imgSrc: '../../assets/media/image/twitter.svg',
      },
      linkedIn: {
        url: '#',
        linkText: 'LinkedIn',
        imgSrc: '../../assets/media/image/linkedIn.svg',
      },
      youtube: {
        url: '#',
        linkText: 'YouTube',
        imgSrc: '../../assets/media/image/youtube.svg',
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
