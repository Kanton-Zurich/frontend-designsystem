const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const defaultImageData = require('../image_figure/image_figure.data');
const defaultRichtextData = require('../richtext/richtext.data');
const defaultVideoData = require('../video/video.data');

const template = dataHelper.getFileContent('accordion.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Accordion',
    className: 'Accordion',
    jira: 'CZHDEV-109',
    documentation: dataHelper.getDocumentation('accordion.md'),
  },
  props: {
    headingLevel: 2,
    title: 'Accordion',
    items: [
      {
        title: 'Kurzer Accordiontitel',
        techName: 'acc_item_1',
        children: [
          {
            text: 'Wird ein Lernfahrgesuch erstmals eingereicht, muss der/die Gesuchsteller/in persönlich bei der Gemeindeverwaltung/Einwohnerkontrolle oder beim Strassenverkehrsamt vorsprechen und einen gültigen Identifikationsnachweis mit Foto (CH-Bürger: Identitätskarte/Pass, Ausländer: Originalausländerausweis) vorlegen. Für die erstmalige Identifikation wird beim Strassenverkehrsamt eine Gebühr von Fr. 20.-- erhoben. Sie haben bereits einmal ein Gesuch eingereicht oder sind bereits im Besitz eines Führerausweises im Kredikartenformat können Sie das Gesuch per Post oder am Schalter direkt einreichen (ohne Identifikationsbestätigung).',
          },
        ],
      },
      {
        title: 'Kurzer Accordiontitel',
        techName: 'acc_item_2',
        children: [
          {
            text: 'Wird ein Lernfahrgesuch erstmals eingereicht, muss der/die Gesuchsteller/in persönlich bei der Gemeindeverwaltung/Einwohnerkontrolle oder beim Strassenverkehrsamt vorsprechen und einen gültigen Identifikationsnachweis mit Foto (CH-Bürger: Identitätskarte/Pass, Ausländer: Originalausländerausweis) vorlegen. Für die erstmalige Identifikation wird beim Strassenverkehrsamt eine Gebühr von Fr. 20.-- erhoben. Sie haben bereits einmal ein Gesuch eingereicht oder sind bereits im Besitz eines Führerausweises im Kredikartenformat können Sie das Gesuch per Post oder am Schalter direkt einreichen (ohne Identifikationsbestätigung).',
          },
          {
            partial: defaultImageData.variants.default.meta.demo,
          },
        ],
      },
      {
        title: 'Ein Accordion mit viel Inhalt und einem langen Titel für Testzwecke',
        techName: 'acc_item_3',
        children: [
          {
            partial: defaultRichtextData.variants.default.meta.demo,
          },
        ],
      },
      {
        title: 'Ein Accordion mit Video',
        techName: 'acc_item_4',
        children: [
          {
            partial: defaultVideoData.variants.withoutTitle.meta.demo,
          },
        ],
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
