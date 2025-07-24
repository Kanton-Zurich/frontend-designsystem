const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const formInputHBS = dataHelper.getFileContent('../../../atoms/form_input/form_input.hbs');
const formInputData = require('../../../atoms/form_input/form_input.data');

module.exports = {
  meta: {
    title: 'ZH-Lex (CZHDEV-1240)',
    desc: 'Flex Data ZH-Lex',
  },
  props: {
    sectionTitle: null,
    groups: [
      {
        rows: [
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(formInputHBS)(
                    _.merge({}, formInputData.variants.default.props, {
                      isFloatingLabel: true,
                      label: 'Stichwort',
                      name: 'fullText',
                      uuid: _.uniqueId('stichwort'),
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
                    _.merge({}, formInputData.variants.default.props, {
                      isFloatingLabel: true,
                      label: 'Erlasstitel',
                      name: 'enactmentTitle',
                      uuid: _.uniqueId('erlasstitel'),
                    })
                  ),
              },
              {
                cellContent: () =>
                  handlebars.compile(formInputHBS)(
                    _.merge({}, formInputData.variants.default.props, {
                      isFloatingLabel: true,
                      label: 'Ordnungsnummer',
                      name: 'referenceNumber',
                      uuid: _.uniqueId('ordnungsnummer'),
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
