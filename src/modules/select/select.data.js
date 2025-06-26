const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defFilterInputData = require('../../atoms/form_input/form_input.data');
const listDemoData = require('../../atoms/list/list.data');
const inputDemoData = require('../../atoms/form_input/form_input.data');

const template = dataHelper.getFileContent('select.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Auswahlfeld',
    className: 'Select',
    jira: 'CZHDEV-846, CZHDEV-848, CZHDEV-852, CZHDEV-992, CZHDEV-1240',
    label: 'Formular',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {

  },
});

const variants = _.mapValues({
  default: {
    meta: {
      title: 'Einzelauswahl',
      desc: 'Standard-Implementation einer Einzelauswahl',
    },
    props: {
      listData: _.merge({}, listDemoData.variants.defaultSingle.props, {
        selectOptions: [
          { value: '', label: '' },
          { value: 'mig', label: 'Migration & Integration' },
          { value: 'mo', label: 'Mobilität' },
          { value: 'sich', label: 'Sicherheit & Justiz' },
          { value: 'so', label: 'Soziales' },
          { value: 'st', label: 'Steuern' },
          { value: 'umte', label: 'Umwelt & Tier' },
          { value: 'ge', label: 'Gemeinschaften' },
          { value: 'scer', label: 'Schulen & Erziehung' },
        ],
        groupId: 'singleSelect',
        setHiddenIndex: true,
      }),
      triggerInputData: inputDemoData.variants.triggerDefault.props,
    },
  },
  selectPhone: {
    meta: {
      title: 'Einzelauswahl (Telefon)',
      desc: 'Einzelauswahl mit Filter',
    },
    props: {
      hasFilter: true,
      listData: _.merge({}, listDemoData.variants.defaultSingle.props, {
        setHiddenIndex: true,
        groupId: 'phoneSingleSelect',
        validation: false,
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
          {
            value: '+41', label: '+41 Switzerland (Schweiz)', id: _.uniqueId('option-item'), preSelected: true,
          },
          { value: '+34', label: '+34 Spain (Spanien)', id: _.uniqueId('option-item') },
          { value: '+963', label: '+963 Syria (‫سوريا‬‎)', id: _.uniqueId('option-item') },
          { value: '+886', label: '+886 Taiwan (台灣))', id: _.uniqueId('option-item') },
          { value: '+66', label: '+66 Thailand (ไทย)‎)', id: _.uniqueId('option-item') },
        ],
      }),
      filterInputData: _.merge({}, defFilterInputData.props, {
        label: 'Telefonvorwahl nach Land wählen',
        type: 'text',
        isSmall: true,
        autocompleteOff: true,
        iconOnly: {
          icon: 'inspect',
        },
        additionalFunctionality: {
          icon: 'clear',
          buttontype: 'clear',
          ariaText: 'Lösche Eingabe',
        },
      }),
      triggerInputData: _.merge({}, inputDemoData.variants.triggerPhone.props, {
        preLabel: 'Telefonvorwahl',
      }),
    },
  },
  defaultMultiPreSelect: {
    meta: {
      title: 'Mehrfachauswahl',
      desc: 'Mehrfachauswahl (mit Vorauswahl)',
    },
    props: {
      isMultiSelect: true,
      hasButton: true,
      listData: _.merge({}, listDemoData.variants.defaultSingle.props, {
        setHiddenIndex: true,
        isMultiSelect: true,
        isSingleSelect: false,
        groupId: 'multiSelect',
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
            value: 'scer', label: 'Schulen & Erziehung', id: _.uniqueId('option-item'),
          },
        ],
      }),
      triggerInputData: inputDemoData.variants.triggerDefault.props,
    },
  },
  multiSelect: {
    meta: {
      title: 'Mehrfachauswahl (Filter)',
      desc: 'Mehrfachauswahl mit Filter',
    },
    props: {
      isMultiSelect: true,
      hasFilter: true,
      hasButton: true,
      groupId: 'multiFilterSelect',
      listData: _.merge({}, listDemoData.variants.iconLeft.props, {
        setHiddenIndex: true,
        isMultiSelect: true,
        isSingleSelect: false,
      }),
      filterInputData: _.merge({}, defFilterInputData.props, {
        label: 'Nach Stichwort filtern',
        type: 'text',
        isSmall: true,
        autocompleteOff: true,
        iconOnly: {
          icon: 'inspect',
        },
        additionalFunctionality: {
          icon: 'clear',
          buttontype: 'clear',
          ariaText: 'Lösche Eingabe',
        },
      }),
      triggerInputData: inputDemoData.variants.triggerDefault.props,
    },
  },
  defaultUpwards: {
    meta: {
      title: 'Einzelauswahl mit Links (List oberhalb)',
      desc: 'Einzelauswahl mit der List oberhalb angeordnet und Links/Anchors als Auswahlitems',
    },
    props: {
      orientationUpwards: true,
      listData: _.merge({}, listDemoData.variants.useAnchor.props,
        listDemoData.variants.useAnchor.props.selectOptions = [], {
          selectOptions: [
            { value: 'de', label: 'Deutsch', preSelected: true },
            { value: 'prt', label: 'Português' },
            { value: 'ru', label: 'Pусский' },
            { value: 'tur', label: 'Türkçe' },
          ],
          groupId: 'singleSelectUpwards',
          setHiddenIndex: true,
        }),
      triggerInputData: inputDemoData.variants.triggerDefault.props,
    },
  },
  table: {
    meta: {
      title: 'Auswahltabelle (CZHDEV-1240)',
      desc: 'Einzelauswahl mit tabellarischer Darstellung der Auswahlliste',
    },
    props: {
      isTable: true,
      listData: listDemoData.variants.table.props,
      triggerInputData: _.merge({}, inputDemoData.variants.triggerDefault.props, {
        uuid: 'ordner_ls',
        label: 'Ordner',
      }),
    },
  },
  singleItem: {
    meta: {
      title: 'Einzelauswahl (nur 1 Item)',
      desc: 'Einzelauswahl, die ein einzelnes Item enthält.',
    },
    props: {
      listData: _.assign(_.merge({}, listDemoData.variants.defaultSingle.props, {
        groupId: 'singleSelectOnlyOneItem',
        setHiddenIndex: true,
      }), {
        selectOptions: [
          { value: 'mig', label: 'Auswahlfeld' },
        ],
      }),
      triggerInputData: inputDemoData.variants.triggerDefault.props,
    },
  },
  history: {
    meta: {
      title: 'Historie-Sprunglinks (CZHDEV-1240)',
      desc: 'Einzelauswahl mit filterbaren Links',
    },
    props: {
      hasFilter: true,
      floatRight: true,
      listData: _.merge({}, listDemoData.variants.useAnchor.props,
        listDemoData.variants.useAnchor.props.selectOptions = [], {
          selectOptions: [
            { value: '091', label: '091 (aktuell)', preSelected: true },
            { value: '090', label: '090 (in Kraft bis 01.02.2018)' },
            { value: '089', label: '089 (in Kraft bis 13.07.2017)' },
            { value: '088', label: '088 (in Kraft bis 01.01.2015)' },
          ],
          groupId: 'singleSelectHistory',
          setHiddenIndex: true,
        }),
      filterInputData: _.merge({}, defFilterInputData.props, {
        label: 'Nachtragsnummer',
        type: 'text',
        isSmall: true,
        autocompleteOff: true,
        iconOnly: {
          icon: 'inspect',
        },
        additionalFunctionality: {
          icon: 'clear',
          buttontype: 'clear',
          ariaText: 'Lösche Eingabe',
        },
      }),
      triggerInputData: inputDemoData.variants.triggerHistory.props,
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
