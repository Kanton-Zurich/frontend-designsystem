const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const imageFigureDemoData = require('../image_figure/image_figure.data');

const template = dataHelper.getFileContent('teaser.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Teaser',
    className: 'Teaser',
    jira: 'CZHDEV-347',
    documentation: dataHelper.getDocumentation('teaser.md'),
  },
  props: _.merge({
    teaserLink: '#',
    teaserTitle_listItem1: 'Hochschulgebiet Zürich Zentrum',
    teaserTitle_listItem2: 'Flughafenbericht 2018 - das ist ein neuer Flughafenbericht des Flughafens Zürich (ZRH). Bericht. Bericht. Bericht. Bericht. Bericht',
    teaserTitle: 'Kanton Zürich Newsletter',
    teaserTitle_headingOnly: 'Dietikon: Ueberlandstrasse wird ausgebaut und leistungsfähiger',
    teaserTitle_maxTextOverlow: '150 Mütter und Väter erhalten am Kantonalen Elternbildungstag Anregungen für den Erziehungsantrag beim Kantonalen Amt.',
    teaserDescription_listItem1: 'Die Projekte von Herzog & de Meuron und Christ & Gantebein werten das Hochschulgebiet Zürich Zentrum (HGZZ) auf.',
    teaserDescription_listItem2: 'Der Regierungsrat hat den Flughafenbericht verabschiedet. Die vorgegeben Ziele wurden erreicht, der Fluglärm-Index stieg hingegen wiederum an. ',
    teaserDescription: 'Der Newsletter des Kantons informiert Sie rasch über verabschiedete Geschäfte des Regierungsrates und hält Sie per E-Mail über Neuigkeiten aus der kantonalen Verwaltung auf dem Laufenden. ',
    teaserDescription_maxTextOverlow: 'Der Elternbildungstag am Samstag, 28 März 2015, rund um das Thema Kind und Familie bot interessierten Vätern und Müttern Anregung für den Erziehungsalltag. Müttern Anregungen für den Erziehungsaltag. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.',
    teaserDisplayDate: '14.12.2018',
    teaserMachineReadableDate: '2018-12-14',
    teaserButtonLabel: 'Mehr erfahren',
  }, imageFigureDemoData.props, {
    srcsets: [{
      image: '/assets/media/image/teaserimage_4_3_584_15.jpeg',
      imageWidth: 1024,
    }, {
      image: '/assets/media/image/teaserimage_16_9_905_15.jpeg',
      imageWidth: 600,
    }, {
      image: '/assets/media/image/teaserimage_16_9_530_15.jpeg',
      imageWidth: 320,
    } ],
  }),
});

const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation - keine Hintergrundfarbe aber mit Datum und Kurztext, Bild-Kachel rechts',
    },
    props: {},
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
