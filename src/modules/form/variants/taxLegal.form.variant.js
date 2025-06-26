const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const selectHBS = dataHelper.getFileContent('../../select/select.hbs');

const listDemoData = require('../../../atoms/list/list.data');

module.exports = {
  meta: {
    title: 'Tax Legal (CZHDEV-1238)',
    desc: 'Selectfelder für Steuerrechner (modules/tax_calc).',
  },
  props: {
    sectionTitle: false,
    groups: [
      {
        rows: [
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(selectHBS)({
                    listData: _.merge({}, listDemoData.variants.defaultSingle.props, {
                      selectOptions: [
                        { value: '0', label: 'Bitte wählen' },
                        { value: '21', label: 'Adlikon' },
                        { value: '131', label: 'Adliswil' },
                        { value: '241', label: 'Aesch' },
                        { value: '1', label: 'Aeugust am Albis' },
                        { value: '2', label: 'Affoltern am Albis' },
                        { value: '211', label: 'Altikon' },
                        { value: '30', label: 'Andelfingen' },
                        { value: '51', label: 'Bachenbülach' },
                      ],
                      setHiddenIndex: true,
                    }),
                    triggerInputData: {
                      type: 'text',
                      isSelectTrigger: true,
                      isFloatingLabel: true,
                      isInput: false,
                      icon: 'angle_drop_down',
                      label: 'Gemeinde',
                      validation: {
                        isRequired: true,
                      },
                    },
                  }),
              },
              {
                cellContent: () =>
                  handlebars.compile(selectHBS)({
                    listData: _.merge({}, listDemoData.variants.defaultSingle.props, {
                      selectOptions: [
                        { value: '2019', label: '2019' },
                        { value: '2018', label: '2018' },
                        { value: '2017', label: '2017' },
                        { value: '2016', label: '2016' },
                        { value: '2015', label: '2015' },
                        { value: '2014', label: '2014' },
                      ],
                      setHiddenIndex: true,
                    }),
                    triggerInputData: {
                      type: 'text',
                      isSelectTrigger: true,
                      isFloatingLabel: true,
                      isInput: false,
                      icon: 'angle_drop_down',
                      label: 'Select Float Label',
                      validation: {
                        isRequired: true,
                      },
                    },
                  }),
              },
            ],
          },
        ],
      },
    ],
  },
};
