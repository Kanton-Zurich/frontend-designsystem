const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const formInputHBS = dataHelper.getFileContent('../../../atoms/form_input/form_input.hbs');
const formInputData = require('../../../atoms/form_input/form_input.data');

const selectHBS = dataHelper.getFileContent('../../select/select.hbs');
const selectData = require('../../select/select.data');

const fileUploadHBS = dataHelper.getFileContent('../../file_upload/file_upload.hbs');
const fileUploadData = require('../../file_upload/file_upload.data');

module.exports = {
  meta: {
    title: 'Formular mit Logik 2 (CZHDEV-1180)',
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
                      listData: {
                        groupId: 'nationality-sf2',
                        isSingleSelect: true,
                        selectOptions: [
                          { value: '', label: '' },
                          { value: 'BE', label: 'Belgien', id: _.uniqueId('cnationalityx') },
                          { value: 'DE', label: 'Deutschland', id: _.uniqueId('cnationalityx') },
                          { value: 'CH', label: 'Schweiz', id: _.uniqueId('cnationalityx') },
                        ],
                        iconRight: 'arrow-right',
                        iconLeft: 'check',
                        validation: {
                          isRequired: true,
                        },
                      },
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
                        name: 'fileupload_SXX',
                        id: 'fileupload_SXX',
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
                              field: 'nationality-sf2',
                              equals: true,
                              value: 'CH',
                            },
                          ],
                          action: 'show',
                        },
                        {
                          conditions: [
                            {
                              field: 'nationality-sf2',
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
                cellContent: () =>
                  handlebars.compile(formInputHBS)(
                    _.merge({}, formInputData.variants.unitLeftWithFloating.props, {
                      isFloatingLabel: true,
                      label: 'Jahreseinkommen',
                      name: 'income_assets',
                      uuid: 'income_assets',
                      validation: {
                        isRequired: false,
                      },
                      rules: JSON.stringify([
                        {
                          conditions: [
                            {
                              field: 'nationality-sf2',
                              equals: false,
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
        ],
      },
    ],
  },
};
