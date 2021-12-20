const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const selectData = require('../select/select.data.js');
const demoTeaserData = require('../teaser/teaser.data').variants.invertedLabeled.props;
const defDatePickerData = require('../datepicker/datepicker.data.js');
const defNewsFilterMobileData = require('../news_filter_mobile/news_filter_mobile.data.js');
const defFilterPillsData = require('../filter_pills/filter_pills.data.js');
const contextMenuItemDef = require('../../atoms/context_menu_item/context_menu_item.data').variants.default.props;
const defNotificationData = require('../../modules/notification/notification.data').variants.default.props;

const templateConverter = require('../../../gulp/helpers/templateConverter');

const dataTopics = [
  { value: 'mig', label: 'Migration & Integration' },
  { value: 'mo', label: 'Mobilität' },
  { value: 'sich', label: 'Sicherheit & Justiz' },
  { value: 'so', label: 'Soziales' },
  { value: 'st', label: 'Steuern' },
  { value: 'umte', label: 'Umwelt & Tier' },
  { value: 'ge', label: 'Gemeinschaften' },
  { value: 'scer', label: 'Schulen & Erziehung' },
];

const dataOrganisations = [
  { value: 'ainf', label: 'Amt für Informatik' },
  { value: 'ajug', label: 'Amt für Jugend & Beruf' },
  { value: 'ajus', label: 'Amt für Justizvollzug' },
  { value: 'amil', label: 'Amt für Militär und Zivilschutz' },
  { value: 'aumw', label: 'Amt für Umwelt' },
  { value: 'aver', label: 'Amt für Verkehr' },
];

const dataNewsTypes = [
  { value: 'mit', label: 'Mitteilung' },
  { value: 'serv', label: 'Services' },
  { value: 'stat', label: 'Statistik' },
  { value: 'vid', label: 'Video' },
  { value: 'wahl', label: 'Wahlen' },
];

const template = dataHelper.getFileContent('news_overview.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'News Übersicht',
    className: 'NewsOverview',
    jira: 'CZHDEV-511',
    label: 'News',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    noResults: 'Keine News zu Ihren Filterkriterien gefunden.',
    noResultsSubText: 'Passen Sie Ihre Filter an oder setzen Sie diese zurück.',
    notificationData: _.merge({}, defNotificationData, {
      message: 'Beim Laden der Daten ist ein Fehler aufgetreten!',
    }),
    typeSelect: _.assign(_.merge({}, selectData.variants.defaultMultiPreSelect.props, {
      listData: {
        validation: {
          isRequired: false,
        },
      },
      triggerInputData: {
        label: 'Typ',
        validation: {
          isRequired: false,
        },
      },
    }), {
      listData: {
        groupPostfix: 'iconLeftMulti',
        iconLeft: 'check',
        isMultiSelect: true,
        hasFilterAndButton: true,
        hasOptionIcon: true,
        hasCheckIcon: true,
        selectOptions: dataNewsTypes,
      },
    }),
    topicSelect: _.assign(_.merge({}, selectData.variants.multiSelect.props, {
      triggerInputData: {
        validation: {
          isRequired: false,
        },
        label: 'Themen',
      },
    }), {
      listData: {
        groupPostfix: 'iconLeftMulti',
        iconLeft: 'check',
        isMultiSelect: true,
        hasFilterAndButton: true,
        hasOptionIcon: true,
        hasCheckIcon: true,
        selectOptions: dataTopics,
      },
    }),
    organisationSelect: _.assign(_.merge({}, selectData.variants.multiSelect.props, {
      triggerInputData: {
        validation: {
          isRequired: false,
        },
        label: 'Organisationen',
      },
    }), {
      listData: {
        groupPostfix: 'iconLeftMulti',
        iconLeft: 'check',
        isMultiSelect: true,
        hasFilterAndButton: true,
        hasOptionIcon: true,
        hasCheckIcon: true,
        selectOptions: dataOrganisations,
      },
    }),
    dateInputData: _.merge({}, defDatePickerData.variants.dateRange.props, {
      formInputData: {
        validation: false,
        label: 'Zeitraum',
      },
    }),
    filterPillsData: defFilterPillsData.props,
    sortContextMenu: {
      lists: [
        {
          items: [
            _.merge({}, contextMenuItemDef, { text: 'Neueste', iconAfter: false, iconBefore: false, additionalAttributes: 'data-sort="new"', isButton: true }),
            _.merge({}, contextMenuItemDef, { text: 'Älteste', iconAfter: false, iconBefore: false, additionalAttributes: 'data-sort="old"', isButton: true }),
            _.merge({}, contextMenuItemDef, { text: 'Relevanz', iconAfter: false, iconBefore: false, additionalAttributes: 'data-sort="relevance"', isButton: true }),
          ],
        },
      ],
    },
    searchInputData: {
      type: 'text',
      label: 'Stichwortsuche',
      isInput: true,
      isFloatingLabel: true,
      iconOnly: {
        icon: 'search',
      },
      additionalFunctionality: {
        icon: 'clear',
        buttontype: 'clear',
        ariaText: 'Lösche Eingabe',
      },
    },
    buttonData: {
      text: 'Filtern',
      isTextVisible: true,
      additionalAttribute: 'type="button" data-news-filter-mobile',
    },
    newsFilterMobileData: _.merge({}, defNewsFilterMobileData.props, {
      modalId: 'news-filter-mobile',
    }),
    prominentTeaser: demoTeaserData,
    newsTeaserTemplate: templateConverter(dataHelper.getFileContent('../news_teaser/_news_teaser_item.hbs'), false),
    topNewsTeaserItems: [
      {
        href: '../news_detail/news_detail.html',
        dateLabel: 'Medienmitteilung',
        date: '14.12.2018',
        dateMachineReadable: '2018-12-14',
        title: 'Winterthur: Unbekannter Mann raubt Tankstellen-Shop aus',
      },
      {
        href: '../news_detail/news_detail.html',
        date: '14.12.2018',
        dateMachineReadable: '2018-12-14',
        title: 'Zürich-Flughafen: Drogenkurier verhaftet und Kokain sichergestellt',
      },
      {
        href: '../news_detail/news_detail.html',
        dateLabel: 'Medienmitteilung',
        date: '14.12.2018',
        dateMachineReadable: '2018-12-14',
        title: 'Weiningen: Vermisstmeldung - Willi Müller',
      },

    ],
  },
});

data.props.newsFilterMobileData.filters[0].filterItems = dataTopics;
data.props.newsFilterMobileData.filters[1].filterItems = dataOrganisations;

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
