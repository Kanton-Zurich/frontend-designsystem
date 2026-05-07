const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const anchorlinkData = require('../../atoms/anchorlink/anchorlink.data').variants.tagTopTags.props;

const inputSearchData = require('../../modules/search/search.data').variants.resultsPage.props;
const extendedSearchData = require('../../modules/extended_search/extended_search.data').variants
  .default.props;
const defNotificationData = require('../notification/notification.data').variants.default.props;
const contentTeaser = require('../../atoms/content_teaser/content_teaser.data');
const defButtonData = require('../../atoms/button/button.data.js');

const template = dataHelper.getFileContent('search_page.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Suchseite (Modul)',
    className: 'SearchPage',
    jira: 'CZHDEV-807',
    documentation: dataHelper.getDocumentation('README.md'),
    label: 'Suche',
  },
  props: {
    input: inputSearchData,
    extendedSearch: extendedSearchData,
    tabs: {
      isScrollable: true,
      tabs: [
        {
          title: 'Inhaltsseiten (<span class="mdl-search_page__count"></span>)',
          id: 'contentpage',
          data: handlebars.compile(
            dataHelper.getFileContent('../search_result_list/search_result_list.hbs')
          )({
            type: 'contentpage',
            title: 'Inhaltsseiten',
            paginationData: {
              pageCount: 1,
              inputId: 'contentpage_pagination_input',
              descriptionId: 'contentpage_pagination_description',
            },
          }),
        },
        {
          title: 'Dokumente (<span class="mdl-search_page__count"></span>)',
          id: 'document',
          data: handlebars.compile(
            dataHelper.getFileContent('../search_result_list/search_result_list.hbs')
          )({
            type: 'document',
            title: 'Dokumente',
            paginationData: {
              pageCount: 1,
              inputId: 'document_pagination_input',
              descriptionId: 'document_pagination_description',
            },
          }),
        },
        {
          title: 'News (<span class="mdl-search_page__count"></span>)',
          id: 'news',
          data: handlebars.compile(
            dataHelper.getFileContent('../search_result_list/search_result_list.hbs')
          )({
            type: 'news',
            title: 'News',
            paginationData: {
              pageCount: 1,
              inputId: 'news_pagination_input',
              descriptionId: 'news_pagination_description',
            },
          }),
        },
        {
          title: 'Services (<span class="mdl-search_page__count"></span>)',
          id: 'service',
          data: handlebars.compile(
            dataHelper.getFileContent('../search_result_list/search_result_list.hbs')
          )({
            type: 'service',
            title: 'Services',
            paginationData: {
              pageCount: 1,
              inputId: 'service_pagination_input',
              descriptionId: 'service_pagination_description',
            },
          }),
        },
        {
          title: 'Personen (<span class="mdl-search_page__count"></span>)',
          id: 'person',
          data: handlebars.compile(
            dataHelper.getFileContent('../search_result_list/search_result_list.hbs')
          )({
            type: 'person',
            title: 'Personen',
            paginationData: {
              pageCount: 1,
              inputId: 'person_pagination_input',
              descriptionId: 'person_pagination_description',
            },
          }),
        },
      ],
    },
    anchorlinks: [
      _.merge({}, anchorlinkData, {
        anchorlink: {
          anchorlinkText: 'Schulferien 2019',
          anchorlinkAdress: '/pages/search/search.html?q=Schulferien 2019',
        },
      }),
      _.merge({}, anchorlinkData, {
        anchorlink: {
          anchorlinkText: 'Kurse für Hundehalter',
          anchorlinkAdress: '/pages/search/search.html?q=Kurse für Hundehalter',
        },
      }),
      _.merge({}, anchorlinkData, {
        anchorlink: {
          anchorlinkText: 'Quellensteuer',
          anchorlinkAdress: '/pages/search/search.html?q=Quellensteuer',
        },
      }),
      _.merge({}, anchorlinkData, {
        anchorlink: {
          anchorlinkText: 'Handelsregistereintrag',
          anchorlinkAdress: '/pages/search/search.html?q=Handelsregistereintrag',
        },
      }),
      _.merge({}, anchorlinkData, {
        anchorlink: {
          anchorlinkText: 'Velo',
          anchorlinkAdress: '/pages/search/search.html?q=Velo',
        },
      }),
      _.merge({}, anchorlinkData, {
        anchorlink: {
          anchorlinkText: 'eAutoindex',
          anchorlinkAdress: '/pages/search/search.html?q=eAutoindex',
        },
      }),
      _.merge({}, anchorlinkData, {
        anchorlink: {
          anchorlinkText: 'Schulferien 2019',
          anchorlinkAdress: '/pages/search/search.html?q=Schulferien 2019',
        },
      }),
    ],
    options: JSON.stringify({
      url: '../../mocks/modules/search_page/search_page.json',
      autosuggestURL: '../../mocks/modules/search/search.json',
      inEstatico: true,
    }),
    templates: {},
    autosuggestTemplate: contentTeaser.variants.default.meta.code.template,
    contentNav: {
      items: [],
      selector: 'data-search_page="autosuggest"',
      additionalClasses: 'mdl-search__autosuggest mdl-content_nav--single-column initially-hidden',
    },
    validationData: _.merge({}, defNotificationData, {
      message: 'Geben Sie einen Suchbegriff mit mindestens 3 Zeichen ein!',
    }),
    notificationData: _.merge({}, defNotificationData, {
      message: 'Beim Laden der Daten ist ein Fehler aufgetreten!',
    }),
    noResultsPlaceholder: {
      title: 'Keine Ergebnisse zu «<span></span>» gefunden.',
      text: 'Überprüfen Sie die Schreibweise der eingegebenen Wörter. Versuchen Sie andere Stichwörter. Versuchen Sie allgemeinere Stichwörter.',
      button: _.merge({}, defButtonData.variants.secondaryWithIcon.props, {
        text: 'Suche zurücksetzen',
        icon: 'undo',
      }),
    },
  },
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Default',
        desc: '',
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
