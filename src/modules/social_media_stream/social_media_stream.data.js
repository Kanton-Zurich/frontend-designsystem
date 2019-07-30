const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('social_media_stream.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Social Media Stream',
    className: 'SocialMediaStream',
    jira: 'CZHDEV-474',
    documentation: dataHelper.getDocumentation('social_media_stream.md'),
  },
  props: {
    posts: [
      {
        author: '@jaquelinefehr',
        datetime: '16.02.2017',
        text: 'Rund 120 Mitarbeitende der Direktion der Justiz und des Innern nutzen den Tag des <a class="atm-text_link" href="" >#Frauenstreik</a>, um in einem Workshop Verbesserungen in ihrem Arbeitsumfeld zu erkennen. Wir machen vorwärts! <a class="atm-text_link" href="" >#jizh</a> <a class="atm-text_link" href="" >https://twitter.com/kantonzuerich/status/1139447071319220224 …</a>',
        link: 'http://www.facebook.com/post1',
        linkLink: '#',
        commentLink: '#',
        forwardLink: '#',
        authorLink: '#',
        icon: '../../assets/media/image/facebook.svg',
        platform: 'facebook',
        likes: 31,
        comments: 5,
        forwards: 23,
      },
      {
        author: '@jaquelinefehr',
        datetime: '16. Juli',
        image: '../../assets/media/image/content_768_x15.jpeg',
        text: '<a class="atm-text_link" href="" >https://www.tagesanzeiger.ch/19913382</a>  Die Frage ist nicht nur, ob die ProfessorIN zurecht entlassen wird. Die Frage ist auch, wieso alle bisherigen Fällen von ungeeigneten, sich daneben benehmenden, übergriffigen ProfessorEN unter dem Mantel des Schweigens verschwanden. <a class="atm-text_link" href="" >@RafaEllaRoth</a>',
        link: 'http://www.twitter.com/tweet1',
        linkLink: '#',
        commentLink: '#',
        forwardLink: '#',
        authorLink: '#',
        icon: '../../assets/media/image/twitter.svg',
        platform: 'twitter',
        likes: 31,
        comments: 5,
        forwards: 23,
      },
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
