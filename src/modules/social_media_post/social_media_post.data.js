const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const templateConverter = require('../../../gulp/helpers/templateConverter');
const template = dataHelper.getFileContent('social_media_post.hbs');

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Social Media Post',
    className: 'SocialMediaPost',
    jira: 'CZHDEV-474',
    label: 'Social media',
    documentation: dataHelper.getDocumentation('README.md'),
    code: {
      template: templateConverter(template.replace(/modules\/social_media_post\//gm, ''), false),
    },
  },
  props: {
  },
});


const variants = _.mapValues({
  default: {
    meta: {
      title: 'Facebook',
      desc: '',
    },
    props: {
      channel: 'Facebook',
      datetime: '16.02.2017, 15:03',
      text: 'Rund 120 Mitarbeitende der Direktion der Justiz und des Innern nutzen den Tag des <a class="atm-text_link" href="" >#Frauenstreik</a>, um in einem Workshop Verbesserungen in ihrem Arbeitsumfeld zu erkennen. Wir machen vorwärts! <a class="atm-text_link" href="#" >#jizh</a> <a class="atm-text_link" href="#" >https://twitter.com/kantonzuerich/status/1139447071319220224 …</a>',
      icon: '../../assets/media/image/facebook.svg',
      link: 'http://www.facebook.com/post1',
      author: {
        name: 'jaqueline.fehr',
        link: 'https://www.facebook/author-link',
      },
      likes: 23,
      comments: 1,
      forwards: 2,
      cite: {
        channel: 'Facebook',
        datetime: '14.02.2017, 15:03',
        image: '../../assets/media/image/content_768_x15.jpeg',
        text: '💙💙💛💛Der Kanton verstärkt sein Engagement für den Schutz von gewaltbetroffenen Frauen. Ab 2020 erhalten die Frauenhäuser massgeblich höhere kantonale Beiträge. <a class="atm-text_link" href="#" >http://ow.ly/saTI50uWdfB</a>',
        icon: '../../assets/media/image/facebook.svg',
        link: 'http://www.facebook.com/post2',
        author: {
          name: 'peter.lustig',
          link: 'https://www.facebook/author-link',
        },
        likes: 2,
        comments: 4,
        forwards: 7,
      },
    },
  },
  twitter: {
    meta: {
      title: 'Twitter',
      desc: '',
    },
    props: {
      channel: 'Twitter',
      datetime: '16. Juli',
      image: '../../assets/media/image/content_768_x15.jpeg',
      text: '<a class="atm-text_link" href="" >https://www.tagesanzeiger.ch/19913382</a>  Die Frage ist nicht nur, ob die ProfessorIN zurecht entlassen wird. Die Frage ist auch, wieso alle bisherigen Fällen von ungeeigneten, sich daneben benehmenden, übergriffigen ProfessorEN unter dem Mantel des Schweigens verschwanden. <a class="atm-text_link" href="" >@RafaEllaRoth</a>',
      link: 'http://www.twitter.com/tweet1',
      author: {
        name: '@jaquelinefehr',
        link: 'https://www.twitter/author-link',
      },
      icon: '../../assets/media/image/twitter.svg',
      likes: 142,
      comments: 30,
      forwards: 87,
    },
  },
  instagram: {
    meta: {
      title: 'Instagram',
      desc: '',
    },
    props: {
      channel: 'Instagram',
      datetime: '16. Juli',
      text: 'Hopp Schwiiz 🇨🇭',
      image: '../../assets/media/image/content_768_x15.jpeg',
      link: 'http://www.instagram.com/post',
      author: {
        name: '@jaquelinefehr',
        link: 'https://www.instagram.com/author-link',
      },
      icon: '../../assets/media/image/instagram.svg',
      likes: 233,
      comments: 2,
      forwards: 2,
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
