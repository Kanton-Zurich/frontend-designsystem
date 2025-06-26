const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const formFieldsetHBS = dataHelper.getFileContent('.././_form.fieldset.hbs');

const checkboxHBS = dataHelper.getFileContent('../../../atoms/checkbox/checkbox.hbs');
const checkboxData = require('../../../atoms/checkbox/checkbox.data');

const radioHBS = dataHelper.getFileContent('../../../atoms/radiobutton/radiobutton.hbs');
const radioData = require('../../../atoms/radiobutton/radiobutton.data');

const selectHBS = dataHelper.getFileContent('../../select/select.hbs');
const selectData = require('../../select/select.data');

const listDemoData = require('../../../atoms/list/list.data');

module.exports = {
  meta: {
    title: 'Checkboxes für Stepper mit Logik',
    desc: '',
  },
  props: {
    sectionTitle: 'Staatsangehörigkeit',
    groups: [
      {
        rows: [
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(selectHBS)(
                    _.merge({}, selectData.variants.default.props, {
                      listData: _.merge({}, listDemoData.props, {
                        groupPostfix: 'nationality-x2',
                        isSingleSelect: true,
                        selectOptions: [
                          { value: '', label: '' },
                          { value: 'BE', label: 'Belgien', id: _.uniqueId('nationalityx') },
                          { value: 'DE', label: 'Deutschland', id: _.uniqueId('nationalityx') },
                          { value: 'FR', label: 'Frankreich', id: _.uniqueId('nationalityx') },
                          { value: 'LU', label: 'Luxemburg', id: _.uniqueId('nationalityx') },
                          { value: 'NL', label: 'Niederlande', id: _.uniqueId('nationalityx') },
                          { value: 'SWE', label: 'Schweden', id: _.uniqueId('nationalityx') },
                          { value: 'CH', label: 'Schweiz', id: _.uniqueId('nationalityx') },
                          {
                            value: 'UK',
                            label: 'Vereinigtes Königreich',
                            id: _.uniqueId('nationalityx'),
                          },
                          {
                            value: 'US',
                            label: 'Vereinigte Staaten',
                            id: _.uniqueId('nationalityx'),
                          },
                        ],
                      }),
                    })
                  ),
              },
            ],
          },
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(formFieldsetHBS)({
                    fieldsetTitle: 'Nationalität',
                    options: [
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'Schweiz',
                            groupName: 'nationality-5',
                            id: 333,
                            value: 'CH',
                          })
                        ),
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            label: 'Nicht Schweiz',
                            groupName: 'nationality-5',
                            id: 334,
                            value: 'none',
                          })
                        ),
                    ],
                  }),
              },
            ],
          },
          {
            fields: [
              {
                isSmall: true,
                cellContent: () =>
                  handlebars.compile(formFieldsetHBS)({
                    fieldsetTitle: 'Nationalität',
                    options: [
                      () =>
                        handlebars.compile(checkboxHBS)(
                          _.merge({}, checkboxData.variants.default.props, {
                            label: 'Sind sie Ausländer/in?',
                            groupName: 'nationality-33',
                            id: 808,
                            value: 'CH',
                          })
                        ),
                    ],
                  }),
              },
            ],
          },
        ],
      },
    ],
  },
};
