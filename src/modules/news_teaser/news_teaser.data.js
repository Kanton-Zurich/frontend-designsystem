const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('news_teaser.hbs');
const demoTeaserData = require('../teaser/teaser.data').variants.inverted.props;

/* const demoImageFigureData = {
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
  alt: '',
  isSmall: false,
  isWide: false,
  hasDownload: false,
  useInCarousel: false,
  noTitle: true,
}; */

const promoTeaserData = _.merge({}, demoTeaserData, {
  teaserHeadingLevel: 3,
});

const demoLinkListData = {
  linkListTitle: 'Weitere aktuelle Meldungen',
  links: [
    {
      linkListItemTitle: 'Vermisste Personen',
      linkListItemHref: '#',
    },
    {
      linkListItemTitle: 'Gesuchte Straftäter',
      linkListItemHref: '#',
    },
    {
      linkListItemTitle: 'Zeugenaufrufe',
      linkListItemHref: '#',
    },
  ],
  hasTitle: true,
  headingLevel: 3,
};

const demoDefaultItems = [
  {
    link: '../../pages/news_detail/news_detail.html',
    type: 'Medienmitteilung',
    date: '14.12.2018',
    title: 'Winterthur: Unbekannter Zeigerdereferenzierungsoperator raubt Tankstellen-Shop aus',
  },
  {
    link: '../../pages/news_detail/news_detail.html',
    date: '14.12.2018',
    title: 'Zürich-Flughafen: Drogenkurier verhaftet und Kokain sichergestellt',
  },
  {
    link: '../../pages/news_detail/news_detail.html',
    type: 'Medienmitteilung',
    date: '14.12.2018',
    title: 'Weiningenasdasdasdasdasd: Vermisstmeldung - Willi Müller',
  },
];

const demoImageItems = _.merge({}, demoDefaultItems, [
  {
    teaserImage: '../../assets/media/image/news_teaser_316x178_x15.jpeg',
  },
  {
    teaserImage: '../../assets/media/image/news_teaser_316x178_x15.jpeg',
  },
  {
    teaserImage: '../../assets/media/image/news_teaser_316x178_x15.jpeg',
  },
]);

const demoTextItems = _.merge({}, demoDefaultItems, [
  {
    title:
      'Zufahrt Strassenverkehrsamt Hinwil erschwert. Bitte planen Sie für Ihre Fahrt genügend Zeit ein',
    teaserText:
      'Strassenbau Winterthur- / Überlandstrassen: Bitte planen Sie für Ihre Fahrt zum ' +
      'Strassenverkehrsamt Hinwil genügend Zeit ein',
  },
  {
    title: 'Vekehrsabgaben 2019',
    teaserText:
      'Alle Infos zu Verkehrsabgabenrechener, Fristen, Ratenzahlung etc. Alle Infos zu Verkehrsabgabenrechener, Fristen, Ratenzahlung etc. Alle Infos zu Verkehrsabgabenrechener, Fristen, Ratenzahlung etc.',
  },
  {
    title: 'Öffnungszeiten Ferientage',
    teaserText:
      'Vom 22. bis 26 Dezember und vom 29. Dezember bis 2. Januar bleiben wir geschlossen. Am 27. und 28. Dezember sind wir für Sie da.',
  },
]);

const data = _.merge({}, defaultData, {
  meta: {
    title: 'News Teaser',
    className: 'NewsTeaser',
    jira: 'CZHDEV-502',
    label: 'Teaser',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    anchorNavReference: 'news_teaser',
  },
});
const variants = _.mapValues(
  {
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
        moduleHeader: {
          title: 'News - extra langer Titel und er geht noch weiter',
          allArticleHref: '#',
          allArticleLabel: 'Alle Beiträge',
        },
        newsTeaserLinkListData: demoLinkListData,
      },
    },
    withoutLinklist: {
      meta: {
        title: 'Weiteren Infos ohne Linkliste',
        desc: 'News Teaser mit Überschrift, Datum und Fliesstext.',
      },
      props: {
        newsTeaserItems: [demoImageItems[0], demoTextItems[1], demoImageItems[2]],
        moduleHeader: {
          title: 'News',
          allArticleHref: '#',
          allArticleLabel: 'Alle Beiträge',
        },
      },
    },
    withProminentTeaser: {
      meta: {
        title: 'Mit prominenten Teaser',
        desc: 'News Teaser mit Überschrift, Datum und Fliesstext.',
      },
      props: {
        newsTeaserItems: [demoImageItems[0], demoTextItems[1], demoImageItems[2]],
        moduleHeader: {
          title: 'News',
          allArticleHref: '#',
          allArticleLabel: 'Alle Beiträge',
        },
        prominentTeaser: promoTeaserData,
      },
    },
    withTwoItems: {
      meta: {
        title: 'Zwei News Teaser',
        desc: 'Mit einem News Teaser',
      },
      props: {
        newsTeaserItems: [demoImageItems[0], demoTextItems[1]],
        moduleHeader: {
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
        moduleHeader: {
          title: 'News',
          allArticleHref: '#',
          allArticleLabel: 'Alle Beiträge',
        },
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
