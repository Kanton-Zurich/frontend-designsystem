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
          value: 'vehicle',
          label: 'Fahrzeug',
        },
        {
          value: 'plate',
          label: 'Autonummern',
        },
        {
          value: 'permit',
          label: 'Führerausweis',
        },
        {
          value: 'bike',
          label: 'Velo',
        },
        {
          value: 'ausweis_schild',
          label: 'Ausweis oder Schild verloren',
        },
        {
          value: 'verwarnung',
          label: 'Ausweisentzug & Verwarnung',
        },
        {
          value: 'schiffahrt',
          label: 'Schiffahrt',
        },
        {
          value: 'spez',
          label: 'Spezielle Bewilligungen',
        },
        {
          value: 'thema1',
          label: 'Thema 1',
        },
        {
          value: 'thema2',
          label: 'Thema 2',
        },
        {
          value: 'thema3',
          label: 'Thema 3',
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
          value: 'org1',
          label: 'Organisation 1',
        },
        {
          value: 'org2',
          label: 'Organisation 2',
        },
        {
          value: 'org3',
          label: 'Organisation 3',
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
