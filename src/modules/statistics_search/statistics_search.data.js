const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const dialog = require('../dialog/dialog.data.js').variants.statistic.props;

const pagination = require('../pagination/pagination.data.js').variants.default.props;
const autosuggestTemplate = require('../../atoms/content_teaser/content_teaser.data').variants
  .default.meta.code.template;
const defNotificationData = require('../notification/notification.data').variants.default.props;
const defFilterPillsData = require('../filter_pills/filter_pills.data.js');
const defButtonData = require('../../atoms/button/button.data.js');

const templateConverter = require('../../../gulp/helpers/templateConverter');

const statisticTeaserTemplate = templateConverter(
  dataHelper.getFileContent('../teaser_card/teaser_card.hbs'),
  false
);

const template = dataHelper.getFileContent('statistics_search.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Statistik Suche',
    className: 'statisticsSearch',
    jira: 'CZHDEV-3837',
    label: 'Suche',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {},
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Standard',
        desc: '',
      },
      props: {
        filterPillsData: { ...defFilterPillsData.props, secondary: true },
        searchInputData: {
          uuid: _.uniqueId('search-input'),
          type: 'text',
          label: 'Suchbegriff',
          isSmall: true,
          isInput: true,
          autocompleteOff: true,
          iconOnly: {
            icon: 'inspect',
          },
          additionalFunctionality: {
            icon: 'clear',
            buttontype: 'clear',
            ariaText: 'Lösche Eingabe',
          },
        },
        noResults: 'Keine Ergebnisse zu Ihren Filterkriterien gefunden.',
        noResultsSubText: 'Passen Sie Ihre Filter an oder setzen Sie diese zurück.',
        noResultResetButton: _.merge({}, defButtonData.variants.secondaryWithIcon.props, {
          text: 'Suche zurücksetzen',
          icon: 'undo',
        }),
        notificationData: _.merge({}, defNotificationData, {
          message: 'Beim Laden der Daten ist ein Fehler aufgetreten!',
        }),
        statisticTeaserTemplate,

        modules: {
          dialog: {
            ...dialog,
            dialogId: _.uniqueId('statisticsSearchDialog'),
            preview: false,
          },
          statisticsTeaser: {
            isSearchResult: true,
            statisticsTeaserItems: [],
          },
          pagination,
          autosuggestTemplate,
          contentNav: {
            items: [],
            selector: 'data-statistics="autosuggest"',
            additionalClasses:
              'mdl-statistics_search__autosuggest mdl-content_nav--single-column initially-hidden',
          },
        },
      },
    },
    withTitle: {
      meta: {
        title: 'Mit Titel',
        desc: '',
      },
      props: {
        anchorNavReference: 'statistics_search',
        heading: {
          level: 2,
          visualLevel: 2,
          title: 'Übersicht Zahlen & Fakten',
          isHidden: false,
        },
        filterPillsData: { ...defFilterPillsData.props, secondary: true },
        searchInputData: {
          uuid: _.uniqueId('search-input'),
          type: 'text',
          label: 'Suchbegriff',
          isSmall: true,
          isInput: true,
          iconOnly: {
            icon: 'inspect',
          },
          additionalFunctionality: {
            icon: 'clear',
            buttontype: 'clear',
            ariaText: 'Lösche Eingabe',
          },
        },
        noResults: 'Keine Ergebnisse zu Ihren Filterkriterien gefunden.',
        noResultsSubText: 'Passen Sie Ihre Filter an oder setzen Sie diese zurück.',
        noResultResetButton: _.merge({}, defButtonData.variants.secondaryWithIcon.props, {
          text: 'Suche zurücksetzen',
          icon: 'undo',
        }),
        notificationData: _.merge({}, defNotificationData, {
          message: 'Beim Laden der Daten ist ein Fehler aufgetreten!',
        }),
        statisticTeaserTemplate,

        modules: {
          dialog: {
            ...dialog,
            dialogId: _.uniqueId('statisticsSearchDialog'),
            preview: false,
          },
          statisticsTeaser: {
            statisticsTeaserItems: [],
          },
          pagination,
          autosuggestTemplate,
          contentNav: {
            items: [],
            selector: 'data-statistics="autosuggest"',
            additionalClasses:
              'mdl-statistics_search__autosuggest mdl-content_nav--single-column initially-hidden',
          },
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
