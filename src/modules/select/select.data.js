const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const listDemoData = require('../../atoms/list/list.data');
const inputDemoData = require('../../atoms/form_input/form_input.data');

const template = dataHelper.getFileContent('select.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Auswahlfeld',
    className: 'Select',
    jira: 'CZHDEV-846, CZHDEV-848, CZHDEV-852, CZHDEV-992',
    documentation: dataHelper.getDocumentation('select.md'),
  },
  props: {

  },
});

const variants = _.mapValues({
  default: {
    meta: {
      title: 'Einzelauswahl(Default)',
      desc: 'Default implementation einer Einzelauswahl',
    },
    props: {
      listData: _.merge({}, listDemoData.variants.defaultSingle.props, { setHiddenIndex: true }),
      triggerInputData: inputDemoData.variants.triggerDefault.props,
    },
  },
  selectPhone: {
    meta: {
      title: 'Einzelauswahl(Telefon)',
      desc: 'Einzelauswahl mit Filter',
    },
    props: {
      hasFilter: true,
      listData: _.merge({}, listDemoData.variants.defaultSingle.props, {
        setHiddenIndex: true,
        selectOptions: [
          { value: '+61', label: '+61 Australia (Australien)', id: _.uniqueId('option-item') },
          { value: '+43', label: '+43 Austria (Österreich)', id: _.uniqueId('option-item') },
          { value: '+32', label: '+32 Belgium (Belgien)', id: _.uniqueId('option-item') },
          { value: '+01', label: '+01 Canada (Kanada)', id: _.uniqueId('option-item') },
          { value: '+385', label: '+385 Croatia (Kroatien)', id: _.uniqueId('option-item') },
          { value: '+45', label: '+86 Denmark (Dänemark)', id: _.uniqueId('option-item') },
          { value: '+33', label: '+33 French (Frankreich)', id: _.uniqueId('option-item') },
          { value: '+49', label: '+49 Germany (Deutschland)', id: _.uniqueId('option-item') },
          { value: '+39', label: '+39 Italy (Italien)', id: _.uniqueId('option-item') },
          { value: '+352', label: '+352 Luxembourg (Luxemburg)', id: _.uniqueId('option-item') },
          { value: '+31', label: '+31 Netherlands (Niederlande)', id: _.uniqueId('option-item') },
          { value: '+86', label: '+86 Peoples Republic of China`(China)', id: _.uniqueId('option-item') },
          { value: '+46', label: '+46 Sweden (Schweden)', id: _.uniqueId('option-item') },
          { value: '+41', label: '+41 Switzerland (Schweiz)', id: _.uniqueId('option-item') },
          { value: '+34', label: '+34 Spain (Spanien)', id: _.uniqueId('option-item') },
          { value: '+963', label: '+963 Syria (‫سوريا‬‎)', id: _.uniqueId('option-item') },
          { value: '+886', label: '+886 Taiwan (台灣))', id: _.uniqueId('option-item') },
          { value: '+66', label: '+66 Thailand (ไทย)‎)', id: _.uniqueId('option-item') },
        ],
      }),
      triggerInputData: inputDemoData.variants.triggerPhone.props,
      filterInputData: inputDemoData.variants.clearButtonSmallWithIcon.props,
    },
  },
  defaultMultiPreSelect: {
    meta: {
      title: 'Mehrfachauswahl(Default)',
      desc: 'Default implementation einer Mehrfachauswahl (mit Vorauswahl)',
    },
    props: {
      isMultiSelect: true,
      listData: _.merge({}, listDemoData.variants.defaultSingle.props, {
        setHiddenIndex: true,
        isMultiSelect: true,
        isSingleSelect: false,
        selectOptions: [
          { value: 'mig', label: 'Migration & Integration', id: _.uniqueId('option-item') },
          { value: 'mo', label: 'Mobilität', id: _.uniqueId('option-item') },
          { value: 'sich', label: 'Sicherheit & Justiz', id: _.uniqueId('option-item') },
          {
            value: 'so', label: 'Soziales', id: _.uniqueId('option-item'),
          },
          {
            value: 'st', label: 'Steuern', id: _.uniqueId('option-item'),
          },
          { value: 'umte', label: 'Umwelt & Tier', id: _.uniqueId('option-item') },
          { value: 'ge', label: 'Gemeinschaften', id: _.uniqueId('option-item') },
          {
            value: 'scer', label: 'Schulen & Erziehung', id: _.uniqueId('option-item'), preSelected: true,
          },
        ],
      }),
      triggerInputData: inputDemoData.variants.triggerDefault.props,
    },
  },
  multiSelect: {
    meta: {
      title: 'Mehrfachauswahl(Filter)',
      desc: 'Default implementation',
    },
    props: {
      isMultiSelect: true,
      hasFilter: true,
      hasFilterAndButton: true,
      listData: _.merge({}, listDemoData.variants.iconLeft.props, {
        setHiddenIndex: true,
        isMultiSelect: true,
        isSingleSelect: false,
      }),
      triggerInputData: inputDemoData.variants.triggerDefault.props,
      filterInputData: inputDemoData.variants.clearButtonSmallWithIcon.props,
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