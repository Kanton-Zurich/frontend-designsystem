const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const {handlebars} = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const selectData = require('../select/select.data.js');
const demoTeaserData = require('../teaser/teaser.data').variants.inverted.props;

const templateConverter = require('../../../gulp/helpers/templateConverter');

const template = dataHelper.getFileContent('news_overview.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'News Übersicht',
    className: 'NewsOverview',
    jira: 'CZHDEV-511',
    documentation: dataHelper.getDocumentation('news_overview.md'),
  },
  props: {
    typeSelect: _.assign(_.merge({}, selectData.variants.defaultMultiPreSelect.props, {
      listData: {
        validation: {
          isRequired: false,
        },
      },
      triggerInputData: {
        label: 'News-Typ',
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
        selectOptions: [
          { value: 'mit', label: 'Mitteilung', id: _.uniqueId('option-item') },
          { value: 'serv', label: 'Services', id: _.uniqueId('option-item') },
          { value: 'stat', label: 'Statistik', id: _.uniqueId('option-item') },
          { value: 'vid', label: 'Video', id: _.uniqueId('option-item') },
          { value: 'wahl', label: 'Wahlen', id: _.uniqueId('option-item') },
        ],
      },
    }),
    topicSelect: _.merge({}, selectData.variants.multiSelect.props, {
      listData: {
        validation: {
          isRequired: false,
        },
      },
      triggerInputData: {
        validation: {
          isRequired: false,
        },
        label: 'Themen',
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
        selectOptions: [
          { value: 'ainf', label: 'Amt für Informatik', id: _.uniqueId('option-item') },
          { value: 'ajug', label: 'Amt für Jugend & Beruf', id: _.uniqueId('option-item') },
          { value: 'ajus', label: 'Amt für Justizvollzug', id: _.uniqueId('option-item') },
          { value: 'amil', label: 'Amt für Militär und Zivilschutz', id: _.uniqueId('option-item') },
          { value: 'aumw', label: 'Amt für Umwelt', id: _.uniqueId('option-item') },
          { value: 'aver', label: 'Amt für Verkehr', id: _.uniqueId('option-item') },
        ],
      },
    }),
    dateInputData: {
      type: 'text',
      label: 'Zeitraum von/bis',
      isInput: true,
      isFloatingLabel: true,
      iconOnly: {
        icon: 'time',
      },
    },
    searchInputData: {
      type: 'text',
      label: 'Filter',
      isInput: true,
      isFloatingLabel: true,
      iconOnly: {
        icon: 'search',
      },
      additionalFunctionality: {
        icon: 'exit',
        buttontype: 'clear',
        ariaText: 'Lösche Eingabe',
      },
    },
    prominentTeaser: demoTeaserData,
    newsTeaserTemplate: templateConverter(dataHelper.getFileContent('../news_teaser/_news_teaser_item.hbs'), false),
    topNewsTeaserItems: [
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
