const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const formInputHBS = dataHelper.getFileContent('../../../atoms/form_input/form_input.hbs');
const formInputData = require('../../../atoms/form_input/form_input.data');

module.exports = {
  meta: {
    title: 'Orientierungsportal Unternehmen (CZHDEV-5048)',
    desc: 'Flex Data für das Orientierungsportal Unternehmen OSS',
  },
  props: {
    sectionTitle: 'Themen im Leben eines Unternehmens',
    additionalClasses: 'visuallyhidden',
    headingLevel: 2,
    groups: [
      {
        rows: [
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(formInputHBS)(
                    _.merge({}, formInputData.variants.default.props, {
                      isFloatingLabel: false,
                      isMedium: true,
                      label: 'Themen durchsuchen',
                      name: 'fullText',
                      uuid: 'fullTextOss',
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
