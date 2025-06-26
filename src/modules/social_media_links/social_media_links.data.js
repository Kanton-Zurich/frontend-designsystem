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
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    heading: {
      title: 'Folgen Sie uns auf',
    },
  },
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Standard',
        desc: 'Standard-Implementation',
      },
      props: {
        heading: {
          level: 2,
          visualLevel: 2,
        },
        items: [
          {
            url: '#',
            linkText: 'Facebook',
            imgSrc: '../../assets/media/image/facebook.svg',
          },
          {
            url: '#',
            linkText: 'Twitter',
            imgSrc: '../../assets/media/image/twitter.svg',
          },
          {
            url: '#',
            linkText: 'linkedIn',
            imgSrc: '../../assets/media/image/linkedIn.svg',
          },
          {
            url: '#',
            linkText: 'YouTube',
            imgSrc: '../../assets/media/image/youtube.svg',
          },
        ],
      },
    },
    contactVariant: {
      meta: {
        title: 'Social Media for contact',
      },
      props: {
        contactVariant: true,
        heading: {
          level: 4,
          visualLevel: 4,
        },
        items: [
          {
            url: '#',
            linkText: 'Facebook',
            imgSrc: '../../assets/media/image/facebook--white.svg',
          },
          {
            url: '#',
            linkText: 'Xing',
            imgSrc: '../../assets/media/image/xing--white.svg',
          },
          {
            url: '#',
            linkText: 'YouTube',
            imgSrc: '../../assets/media/image/youtube--white.svg',
          },
          {
            url: '#',
            linkText: 'linkedIn',
            imgSrc: '../../assets/media/image/linkedIn--white.svg',
          },
        ],
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
