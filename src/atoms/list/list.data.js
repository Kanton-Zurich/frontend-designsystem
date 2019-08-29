const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('list.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Liste',
    className: 'List',
    jira: 'CZHDEV-*',
    documentation: dataHelper.getDocumentation('list.md'),
  },
  props: {
    iconRight: 'arrow-right',
    iconLeft: 'check',
    groupPostfix: 'default',
    selectOptions: [
      { value: 'mig', label: 'Migration & Integration', id: _.uniqueId('option-item') },
      { value: 'mo', label: 'Mobilität', id: _.uniqueId('option-item') },
      { value: 'sich', label: 'Sicherheit & Justiz', id: _.uniqueId('option-item') },
      { value: 'so', label: 'Soziales', id: _.uniqueId('option-item') },
      { value: 'st', label: 'Steuern', id: _.uniqueId('option-item') },
      { value: 'umte', label: 'Umwelt & Tier', id: _.uniqueId('option-item') },
      { value: 'ge', label: 'Gemeinschaften', id: _.uniqueId('option-item') },
      { value: 'scer', label: 'Schulen & Erziehung', id: _.uniqueId('option-item') },
    ],
  },
});
const variants = _.mapValues({
  defaultSingle: {
    meta: {
      title: 'Default(Einzelauswahl)',
      desc: 'Default implementation',
    },
    props: {
      groupPostfix: 'defaultSingle',
      isSingleSelect: true,
    },
  },
  defaultMulti: {
    meta: {
      title: 'Default(Mehrfachauswahl)',
      desc: 'Default implementation',
    },
    props: {
      groupPostfix: 'defaultMulti',
      isMultiSelect: true,
    },
  },
  iconLeftPreselected: {
    meta: {
      title: 'Mehrfachauswahl mit Vorauswahl und Icon links',
      desc: 'Liste mit Icon links nur bei Auswahl',
    },
    props: {
      groupPostfix: 'iconLeftMulti',
      isMultiSelect: true,
      hasFilterAndButton: true,
      hasOptionIcon: true,
      hasCheckIcon: true,
      selectOptions: [
        { value: 'mig', label: 'Migration & Integration', id: _.uniqueId('option-item') },
        { value: 'mo', label: 'Mobilität', id: _.uniqueId('option-item') },
        { value: 'sich', label: 'Sicherheit & Justiz', id: _.uniqueId('option-item') },
        {
          value: 'so',
          label: 'Soziales',
          id: _.uniqueId('option-item'),
          preSelected: true,
        },
        {
          value: 'st',
          label: 'Steuern',
          id: _.uniqueId('option-item'),
          preSelected: true,
        },
        { value: 'umte', label: 'Umwelt & Tier', id: _.uniqueId('option-item') },
        { value: 'ge', label: 'Gemeinschaften', id: _.uniqueId('option-item') },
        { value: 'scer', label: 'Schulen & Erziehung', id: _.uniqueId('option-item') },
      ],
    },
  },
  iconLeft: {
    meta: {
      title: 'Mehrfachauswahl mit Icon links',
      desc: 'Liste mit Icon links nur bei Auswahl',
    },
    props: {
      groupPostfix: 'iconLeftMulti',
      isMultiSelect: true,
      hasFilterAndButton: true,
      hasOptionIcon: true,
      hasCheckIcon: true,
      selectOptions: [
        { value: 'mig', label: 'Migration & Integration', id: _.uniqueId('option-item') },
        { value: 'mo', label: 'Mobilität', id: _.uniqueId('option-item') },
        { value: 'sich', label: 'Sicherheit & Justiz', id: _.uniqueId('option-item') },
        { value: 'so', label: 'Soziales', id: _.uniqueId('option-item') },
        { value: 'st', label: 'Steuern', id: _.uniqueId('option-item') },
        { value: 'umte', label: 'Umwelt & Tier', id: _.uniqueId('option-item') },
        { value: 'ge', label: 'Gemeinschaften', id: _.uniqueId('option-item') },
        { value: 'scer', label: 'Schulen & Erziehung', id: _.uniqueId('option-item') },
      ],
    },
  },
  iconRight: {
    meta: {
      title: 'Einzelauswahl mit Icon rechts',
      desc: 'Liste mit Icon rechts',
    },
    props: {
      groupPostfix: 'iconRightSingle',
      isSingleSelect: true,
      hasOptionIcon: true,
      hasIconRight: true,
    },
  },
  iconBoth: {
    meta: {
      title: 'Einzelauswahl mit Icon rechts und links',
      desc: 'Liste mit Icon rechts und links',
    },
    props: {
      groupPostfix: 'iconBothSingle',
      isSingleSelect: true,
      hasOptionIcon: true,
      hasIconLeft: true,
      hasIconRight: true,
      iconLeft: 'location',
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
        data: dataHelper.getFormattedJson(variantProps),
        html: dataHelper.getFormattedHtml(compiledVariant()),
      },
    },
  });

  return variantData;
});

data.variants = variants;

module.exports = data;
