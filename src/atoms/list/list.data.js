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
    validation: {
      isRequired: true,
    },
  },
});
const variants = _.mapValues({
  defaultSingle: {
    meta: {
      title: 'Default(Einzelauswahl)',
      desc: 'Default implementation',
    },
    props: {
      groupId: 'defaultSingle',
      isSingleSelect: true,
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
  defaultMulti: {
    meta: {
      title: 'Default(Mehrfachauswahl)',
      desc: 'Default implementation',
    },
    props: {
      groupId: 'defaultMulti',
      isMultiSelect: true,
    },
  },
  iconLeftPreselected: {
    meta: {
      title: 'Mehrfachauswahl mit Vorauswahl und Icon links',
      desc: 'Liste mit Icon links nur bei Auswahl',
    },
    props: {
      groupId: 'iconLeftMulti',
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
      groupId: 'iconLeftMulti',
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
      groupId: 'iconRightSingle',
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
      groupId: 'iconBothSingle',
      isSingleSelect: true,
      hasOptionIcon: true,
      hasIconLeft: true,
      hasIconRight: true,
      iconLeft: 'location',
    },
  },
  useAnchor: {
    meta: {
      title: 'Liste mit Links',
      desc: 'Einzelauswahl mit Links statt selectierbaren Items',
    },
    props: {
      useAnchors: true,
      groupId: 'iconBothSingle',
      isSingleSelect: true,
    },
  },
  table: {
    meta: {
      title: 'Auswahltabelle',
      desc: 'Einzelauswahl mit tabellarischer Darstellung der Auswahlliste',
    },
    props: {
      groupId: 'fileNumber',
      isSingleSelect: true,
      isTable: true,
      selectTableHeaders: ['Nr.', 'Ordnungsnummer', 'Thema'],
      selectOptions: [
        { value: '1', label: '1', selectTableCells: ['101 - 176', 'Verfassung - Kantonsgebiet - Gemeinden - Bürgerrecht - Politische Rechte - Behörden'], id: _.uniqueId('fileNumber') },
        { value: '2', label: '2', selectTableCells: ['177 - 184', 'Staatspersonal - Kirchen - Religionsgemeinschaften'], id: _.uniqueId('fileNumber') },
        { value: '3', label: '3', selectTableCells: ['211 - 255', 'Gerichtsorganisation - Zivilrecht - Notariat - Grundbuch'], id: _.uniqueId('fileNumber') },
        { value: '4', label: '4', selectTableCells: ['281 - 351', 'Schuldbetreibung und Konkurs - Strafrecht - Strafvollzug - Opferhilfe - Gewaltschutz'], id: _.uniqueId('fileNumber') },
        { value: '5', label: '5', selectTableCells: ['410 - 412', 'Bildung - Volksschule'], id: _.uniqueId('fileNumber') },
        { value: '6', label: '6', selectTableCells: ['413', 'Mittelschulen - Berufsbildung'], id: _.uniqueId('fileNumber') },
        { value: '7', label: '7', selectTableCells: ['414', 'Fachhochschulen'], id: _.uniqueId('fileNumber') },
        { value: '8', label: '8', selectTableCells: ['415 - 440', 'Universität - Dokumentation - Kultur'], id: _.uniqueId('fileNumber') },
        { value: '9', label: '9', selectTableCells: ['511 - 554', 'Militär - Bevölkerungsschutz - Polizei'], id: _.uniqueId('fileNumber') },
        { value: '10', label: '10', selectTableCells: ['611 - 691', 'Finanzhaushalt - Steuern - Gebühren'], id: _.uniqueId('fileNumber') },
        { value: '11', label: '11', selectTableCells: ['700 - 715', 'Raumplanung - Baurecht - Umweltschutz'], id: _.uniqueId('fileNumber') },
        { value: '12', label: '12', selectTableCells: ['720 - 782', 'Beschaffungswesen - Strassen - Wasserwirtschaft - Energie - Verkehr - Enteignung'], id: _.uniqueId('fileNumber') },
        { value: '13', label: '13', selectTableCells: ['810 - 857', 'Gesundheit - Arbeit - Sozialversicherung - Fürsorge'], id: _.uniqueId('fileNumber') },
        { value: '14', label: '14', selectTableCells: ['861 - 954', 'Feuerpolizei - Landwirtschaft - Wald und Jagd - Industrie und Gewerbe - Handel - Banken'], id: _.uniqueId('fileNumber') },
      ],
      validation: null,
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
