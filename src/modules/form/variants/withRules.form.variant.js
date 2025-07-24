const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const formInputHBS = dataHelper.getFileContent('../../../atoms/form_input/form_input.hbs');
const formInputData = require('../../../atoms/form_input/form_input.data');

const formFieldsetHBS = dataHelper.getFileContent('.././_form.fieldset.hbs');

const checkboxHBS = dataHelper.getFileContent('../../../atoms/checkbox/checkbox.hbs');
const checkboxData = require('../../../atoms/checkbox/checkbox.data');

const selectHBS = dataHelper.getFileContent('../../select/select.hbs');
const selectData = require('../../select/select.data');

const fileUploadHBS = dataHelper.getFileContent('../../file_upload/file_upload.hbs');
const fileUploadData = require('../../file_upload/file_upload.data');

const listDemoData = require('../../../atoms/list/list.data');

module.exports = {
  meta: {
    title: 'Formular mit Logik (CZHDEV-1180)',
    desc: 'Formular in dem Felder in gewissen Abhängigkeiten zu einander stehen',
  },
  props: {
    groups: [
      {
        rows: [
          {
            fields: [
              {
                isSmall: true,
                cellContent: () =>
                  handlebars.compile(selectHBS)(
                    _.merge({}, selectData.variants.default.props, {
                      listData: _.merge({}, listDemoData.props, {
                        groupId: 'nationality-f2',
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
                  handlebars.compile(fileUploadHBS)(
                    _.merge({}, fileUploadData.variants.default.props, {
                      input: {
                        name: 'fileupload_XX',
                        id: 'fileupload_XX',
                      },
                      validation: {
                        maxSize: 26214400,
                        fileTypes:
                          'text/csv, image/gif, text/html, image/jpeg, application/pdf, image/png, image/tiff, application/rtf, image/svg+xml, text/plain, application/xml',
                        isRequired: true,
                      },
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'nationality-f2',
                              equals: true,
                              value: 'CH',
                            },
                          ],
                          action: 'show',
                        },
                        {
                          conditions: [
                            {
                              field: 'nationality-f2',
                              equals: true,
                              value: 'DE',
                            },
                          ],
                          action: 'show',
                        },
                      ]),
                    })
                  ),
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
                            groupName: 'nationality-3',
                            id: 200,
                            value: 'CH',
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
                cellContent: () =>
                  handlebars.compile(formInputHBS)(
                    _.merge({}, formInputData.props, {
                      isFloatingLabel: true,
                      label: 'Bürgerort',
                      name: 'place_of_citizenship',
                      uuid: 'place_of_citizenship',
                      validation: {
                        isRequired: true,
                      },
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'nationality-3',
                              equals: true,
                              value: 'CH',
                            },
                          ],
                          action: 'hide',
                        },
                      ]),
                    })
                  ),
              },
            ],
          },
        ],
      },
    ],
  },
};
