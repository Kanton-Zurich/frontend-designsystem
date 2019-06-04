const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const defaultImageData = require('../image_figure/image_figure.data');
const defaultRichtextData = require('../richtext/richtext.data');
const defaultVideoData = require('../video/video.data');

// Module für Weiterführende Informationen
const downloadListData = require('../download_list/download_list.data');
const linklistData = require('../linklist/linklist.data');
const tableData = require('../table/table.data');
const publicationTeaserData = require('../publication_teaser/publication_teaser.data');

const template = dataHelper.getFileContent('accordion.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Accordion',
    className: 'Accordion',
    jira: 'CZHDEV-109',
    documentation: dataHelper.getDocumentation('accordion.md'),
  },
  props: {
    accordionHeading: {
      level: 2,
      title: 'Accordion',
    },
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
  furtherInformation: {
    meta: {
      title: 'Weiterführende Informationen',
      desc: 'Das Accordion in der Variante "Weiterführende Informationen"',
    },
    props: {
      accordionHeading: {
        level: 2,
        title: 'Weiterführende Informationen',
      },
      items: [
        {
          title: 'Merkblätter & Downloads',
          techName: 'wi_item_1',
          children: [
            {
              partial: downloadListData.variants.defaultWithoutTitle.meta.demo(),
            },
          ],
        },
        {
          title: 'Weiterführende Links',
          techname: 'wi_item_2',
          children: [
            {
              partial: linklistData.variants.noTitle.meta.demo(),
            },
          ],
        },
        {
          title: 'Rechtliche Grundlagen',
          techName: 'wi_item_3',
          children: [
            {
              partial: downloadListData.variants.legalFoundationDownloadListNoTitle.meta.demo(),
            },
          ],
        },
        {
          title: 'Daten & Statistiken',
          techName: 'wi_item_4',
          children: [
            {
              text: 'Das ist ein Beispieltext für die Komponente "Weiterführende Informationen".',
            },
            {
              partial: defaultImageData.variants.default.meta.demo,
            },
            {
              partial: tableData.variants.default.meta.demo,
            },
            {
              partial: publicationTeaserData.variants.default.meta.demo,
            },
          ],
        },
      ],
    },
  },
}, (variant) => {
  // eslint-disable-next-line consistent-return
  const variantProps = _.mergeWith({}, data, variant, (dataValue, variantValue, key) => {
    if (key === 'items' || key === 'children') {
      return variantValue;
    }
  }).props;
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
