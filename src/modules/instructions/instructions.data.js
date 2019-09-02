const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const richtextDemoData = require('../richtext/richtext.data');
const linklistDemoData = require('../linklist/linklist.data');
const videoDemoData = require('../video/video.data');
const imageFigureDemoData = require('../image_figure/image_figure.data');
const carouselDemoData = require('../carousel/carousel.data');
const texthighlightDemoData = require('../texthighlight/texthighlight.data');
const defTabsData = require('../tabs/tabs.data');


const template = dataHelper.getFileContent('instructions.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Anleitung',
    className: 'Instructions',
    jira: 'CZHDEV-223',
    documentation: dataHelper.getDocumentation('instructions.md'),
  },
  props: _.merge({ instructions_title: 'Anleitung (H2)' },
    richtextDemoData.props, linklistDemoData.props, videoDemoData.props, { headingLevel: 4 },
    imageFigureDemoData.props, carouselDemoData.props, { title: { level: 4 } },
    texthighlightDemoData.props),
});

const variants = _.mapValues({
  default: {
    meta: {
      title: 'Anleitungsliste',
      desc: 'Standard-Implementation mit einer nummerierten Liste',
    },
    props: {
      videoId: 'QHCHVcU3_w4',
      texthighlightId: _.uniqueId('texthighlight'),
    },
  },
  unordered: {
    meta: {
      title: 'Checkpunktliste',
      desc: 'Standard-Implementation mit einer unnummerierten Liste',
    },
    props: {
      isUnordered: true,
      videoId: 'xk0DEe_syF4',
      texthighlightId: _.uniqueId('texthighlight'),
    },
  },
  serviceDemo: {
    meta: {
      title: 'Service',
      desc: '',
    },
    props: {
      isUnordered: false,
      service: true,
      tabs: defTabsData.props.tabs,
      instructions_title: 'Service Beschreibung',
      linklist: {
        list1: {
          links: [
            {
              linkListItemTitle: 'Stellungsnahme des Direktors', linkListItemHref: '/',
            },
          ],
        },
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
