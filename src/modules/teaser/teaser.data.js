const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const imageFigureDemoData = require('../image_figure/image_figure.data');

const template = dataHelper.getFileContent('teaser.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'teaser',
    className: 'Teaser',
    jira: 'CZHDEV-347',
    documentation: dataHelper.getDocumentation('teaser.md'),
  },
  props: _.merge({
    teaserLink: '#',
    teaserTitle_listItem1: 'Hochschulgebiet Zürich Zentrum',
    teaserTitle_listItem2: 'Flughafenbericht 2018',
    teaserTitle: 'Kanton Zürich Newsletter',
    teaserTitle_headingOnly: 'Dietikon: Ueberlandstrasse wird ausgebaut und leistungsfähiger',
    teaserTitle_maxTextOverlow: '150 Mütter und Väter erhalten am Kantonalen Elternbildungstag Anregungen für den Erziehungsantrag beim Kantonalen Amt.',
    teaserDescription_listItem1: 'Die Projekte von Herzog & de Meuron und Christ & Gantebein werten das Hochschulgebiet Zürich Zentrum (HGZZ) auf.',
    teaserDescription_listItem2: 'Der Regierungsrat hat den Flughafenbericht verabschiedet. Die vorgegeben Ziele wurden erreicht, der Fluglärm-Index stieg hingegen wiederum an. ',
    teaserDescription: 'Der Newsletter des Kantons informiert Sie rasch über verabschiedete Geschäfte des Regierungsrates und hält Sie per E-Mail über Neuigkeiten aus der kantonalen Verwaltung auf dem Laufenden. ',
    teaserDisplayDate: '14.12.2018',
    teaserMachineReadableDate: '2018-12-14',
    teaserButtonLabel: 'Mehr erfahren',
  }, imageFigureDemoData.props),
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation - keine Hintergrundfarbe aber mit Datum und Kurztext, Bild-Kachel rechts',
    },
    props: {},
  },
  blue: {
    meta: {
      title: 'Ausprägung: Blau',
      desc: '',
    },
    props: {
      colorVariation: 'blue',
    },
  },
  darkblue: {
    meta: {
      title: 'Ausprägung: Dunkelblau',
      desc: '',
    },
    props: {
      colorVariation: 'darkblue',
    },
  },
  turqoise: {
    meta: {
      title: 'Ausprägung: Türkis',
      desc: '',
    },
    props: {
      colorVariation: 'turqoise',
    },
  },
  green: {
    meta: {
      title: 'Ausprägung :Grün',
      desc: '',
    },
    props: {
      colorVariation: 'green',
    },
  },
  bordeaux: {
    meta: {
      title: 'Ausprägung: Bordeaux',
      desc: '',
    },
    props: {
      colorVariation: 'bordeaux',
    },
  },
  magenta: {
    meta: {
      title: 'Ausprägung: Magenta',
      desc: '',
    },
    props: {
      colorVariation: 'magenta',
    },
  },
  violet: {
    meta: {
      title: 'Ausprägung: Violett',
      desc: '',
    },
    props: {
      colorVariation: 'violet',
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
