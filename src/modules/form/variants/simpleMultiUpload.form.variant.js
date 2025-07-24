const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const fileUploadHBS = dataHelper.getFileContent('../../file_upload/file_upload.hbs');
const fileUploadData = require('../../file_upload/file_upload.data');

module.exports = {
  meta: {
    title: 'Test: Multi upload',
    desc: '',
  },
  props: {
    groups: [
      {
        rows: [
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(fileUploadHBS)(
                    _.merge({}, fileUploadData.variants.multiple.props, {
                      validation: {
                        maxSize: 26214400,
                        fileTypes:
                          'text/csv, image/gif, text/html, image/jpeg, application/pdf, image/png, image/tiff, application/rtf, image/svg+xml, text/plain, application/xml',
                        isRequired: true,
                      },
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
