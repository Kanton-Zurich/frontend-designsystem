const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('news_teaser.hbs');

const demoImageFigureData = {
  srcsets: [
    {
      image: '/assets/media/image/news_teaser_208x117_x15.jpeg',
      imageWidth: 600,
    },
    {
      image: '/assets/media/image/news_teaser_240x135_x15.jpg',
      imageWidth: 601,
    },
    {
      image: '/assets/media/image/news_teaser_316x178_x15.jpeg',
      imageWidth: 1025,
    },
  ],
  alt: 'Das ist ein Beispielbild',
  isSmall: false,
  isWide: false,
  hasDownload: false,
  useInCarousel: false,
  noTitle: true,
};

const demoLinkListData = {
  linkListTitle: 'Weitere aktuelle Meldungen',
  links: [
    {
      linkListItemTitle: 'Vermisste Personen',
      linkListItemHref: '#',
    }, {
      linkListItemTitle: 'Gesuchte Straftäter',
      linkListItemHref: '#',
    }, {
      linkListItemTitle: 'Zeugenaufrufe',
      linkListItemHref: '#',
    },
  ],
  hasTitle: true,
  headingLevel: 4,
};

const demoDefaultItems = [
  {
    href: '#',
    dateLabel: 'Medienmitteilung',
    date: '14.12.2018',
    dateMachineReadable: '2018-12-14',
    title: 'Winterthur: Unbekannter Mann raubt Tankstellen-Shop aus',
  },
  {
    href: '#',
    date: '14.12.2018',
    dateMachineReadable: '2018-12-14',
    title: 'Zürich-Flughafen: Drogenkurier verhaftet und Kokain sichergestellt',
  },
  {
    href: '#',
    dateLabel: 'Medienmitteilung',
    date: '14.12.2018',
    dateMachineReadable: '2018-12-14',
    title: 'Weiningen: Vermisstmeldung - Willi Müller',
  },
];

const demoImageItems = _.merge({}, demoDefaultItems, [
  {
    imageData: demoImageFigureData,
  },
  {
    imageData: demoImageFigureData,
  },
  {
    imageData: demoImageFigureData,
  },
]);

const demoTextItems = _.merge({}, demoDefaultItems, [
  {
    title: 'Zufahrt Strassenverkehrsamt Hinwil erschwert',
    text: 'Strassenbau Winterthur- / Überlandstrassen: Bitte planen Sie für Ihre Fahrt zum '
    + 'Strassenverkehrsamt Hinwil genügend Zeit ein',
  },
  {
    title: 'Vekehrsabgaben 2019',
    text: 'Alle Infos zu Verkehrsabgabenrechener, Fristen, Ratenzahlung etc',
  },
  {
    title: 'Öffnungszeiten Ferientage',
    text: 'Vom 22. bis 26 Dezember und vom 29. Dezember bis 2. Januar bleiben wir geschlossen. Am 27. und 28. Dezember sind wir für Sie da.',
  },
]);

const data = _.merge({}, defaultData, {
  meta: {
    title: 'News Teaser',
    className: 'NewsTeaser',
    jira: 'CZHDEV-502',
    documentation: dataHelper.getDocumentation('news_teaser.md'),
  },
  props: {},
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation. News Teaser nur mit Überschrift.',
    },
    props: {
      newsTeaserItems: _.merge({}, demoDefaultItems),
    },
  },
  withImages: {
    meta: {
      title: 'Mit Bild',
      desc: 'News Teaser mit Überschrift, Datum und Bild.',
    },
    props: {
      newsTeaserItems: _.merge({}, demoImageItems),
    },
  },
  withText: {
    meta: {
      title: 'Mit Text',
      desc: 'News Teaser mit Überschrift, Datum und Fliesstext.',
    },
    props: {
      newsTeaserItems: demoTextItems,
    },
  },
  withMoreInfos: {
    meta: {
      title: 'Mit weiteren Infos',
      desc: 'News Teaser mit Überschrift, Datum und Fliesstext.',
    },
    props: {
      newsTeaserItems: [demoImageItems[0], demoTextItems[1], demoImageItems[2]],
      newsTeaserModuleHeader: {
        title: 'News',
        allArticleHref: '#',
        allArticleLabel: 'Alle Beiträge',
      },
      newsTeaserLinkListData: demoLinkListData,
    },
  },
  withTwoItems: {
    meta: {
      title: 'Zwei News Teaser',
      desc: 'Mit einem News Teaser',
    },
    props: {
      newsTeaserItems: [demoImageItems[0], demoTextItems[1]],
      newsTeaserModuleHeader: {
        title: 'News',
        allArticleHref: '#',
        allArticleLabel: 'Alle Beiträge',
      },
    },
  },
  withOneItems: {
    meta: {
      title: 'Ein News Teaser',
      desc: 'Mit einem News Teaser',
    },
    props: {
      newsTeaserItems: [demoImageItems[0]],
      newsTeaserModuleHeader: {
        title: 'News',
        allArticleHref: '#',
        allArticleLabel: 'Alle Beiträge',
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
