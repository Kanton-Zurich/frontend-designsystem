const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const {handlebars} = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defFilterInputData = require('../../atoms/form_input/form_input.data');

const template = dataHelper.getFileContent('news_filter_mobile.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'News Filter Mobile',
    className: 'NewsFilterMobile',
    jira: 'CZHDEV-990',
    documentation: dataHelper.getDocumentation('news_filter_mobile.md'),
  },
  props: {
    modalId: 'testFilter',
    dateDropDown: {
      linkListItemTitle: 'Zeitraum',
      isButton: true,
      subtitle: '20.08.2019 - 30.08.2019',
      noColor: true,
      chevron: true,
      modalFocus: true,
    },
    topicFilter: {
      linkListItemTitle: 'Themen',
      isButton: true,
      subtitle: ' ',
      subTitlePattern: '% gewählt',
      noColor: true,
      topicFilterInput: _.merge({}, defFilterInputData.props, {
        label: 'Themen nach Stichwort filtern',
        dataSelector: 'data-topiclist="input"',
        isSmall: true,
        additionalFunctionality: {
          icon: 'clear',
          buttontype: 'clear',
          ariaText: 'Lösche Eingabe',
          ariaControls: 'topicSelect',
        },
      }),
      topics: [
        {
          id: _.uniqueId('topic-'),
          value: 'vehicle',
          title: 'Fahrzeug',
        },
        {
          id: _.uniqueId('topic-'),
          value: 'plate',
          title: 'Autonummern',
        },
        {
          id: _.uniqueId('topic-'),
          value: 'permit',
          title: 'Führerausweis',
        },
        {
          id: _.uniqueId('topic-'),
          value: 'bike',
          title: 'Velo',
        },
        {
          id: _.uniqueId('topic-'),
          value: 'ausweis_schild',
          title: 'Ausweis oder Schild verloren',
        },
        {
          id: _.uniqueId('topic-'),
          value: 'verwarnung',
          title: 'Ausweisentzug & Verwarnung',
        },
        {
          id: _.uniqueId('topic-'),
          value: 'schiffahrt',
          title: 'Schiffahrt',
        },
        {
          id: _.uniqueId('topic-'),
          value: 'spez',
          title: 'Spezielle Bewilligungen',
        },
        {
          id: _.uniqueId('topic-'),
          value: 'thema1',
          title: 'Thema 1',
        },
        {
          id: _.uniqueId('topic-'),
          value: 'thema2',
          title: 'Thema 2',
        },
        {
          id: _.uniqueId('topic-'),
          value: 'thema3',
          title: 'Thema 3',
        },
      ],
    },
    organisationFilter: {
      linkListItemTitle: 'Organisation',
      isButton: true,
      subtitle: ' ',
      subTitlePattern: '% gewählt',
      noColor: true,
      organisationFilterInput: _.merge({}, defFilterInputData.props, {
        label: 'Organisation nach Stichwort filtern',
        dataSelector: 'data-organisationlist="input"',
        isSmall: true,
        additionalFunctionality: {
          icon: 'clear',
          buttontype: 'clear',
          ariaText: 'Lösche Eingabe',
          ariaControls: 'organisationSelect',
        },
      }),
      organisations: [
        {
          id: _.uniqueId('organisation-'),
          value: 'org1',
          title: 'Organisation 1',
        },
        {
          id: _.uniqueId('organisation-'),
          value: 'org2',
          title: 'Organisation 2',
        },
        {
          id: _.uniqueId('organisation-'),
          value: 'org3',
          title: 'Organisation 3',
        },
      ],
    },
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
    props: {
      preview: true,
    }
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
