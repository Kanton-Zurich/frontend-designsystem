const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const formFieldsetHBS = dataHelper.getFileContent('.././_form.fieldset.hbs');

const radioHBS = dataHelper.getFileContent('../../../atoms/radiobutton/radiobutton.hbs');
const radioData = require('../../../atoms/radiobutton/radiobutton.data');

module.exports = {
  meta: {
    title: 'Tax Entity (CZHDEV-1238)',
    desc: 'Radiobutton Auswahl für Steuerrechner (modules/tax_calc).',
  },
  props: {
    sectionTitle: false,
    groups: [
      {
        rows: [
          {
            fields: [
              {
                isSmall: true,
                cellContent: () =>
                  handlebars.compile(formFieldsetHBS)({
                    fieldsetTitle: 'Für wen möchten Sie den Steuerbetrag berechnen?',
                    isFieldsetTitleHidden: true,
                    isVertical: true,
                    requiredMessage: 'Bitte wählen Sie eine Option aus.',
                    options: [
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            id: 'privatperson',
                            groupName: 'taxEntity',
                            label: 'Privatperson',
                            descr:
                              'Berechnen von Bundes-, Staats- und Gemeindesteuerbetrag, Steuerbetrag auf Kapitalleistungen aus Vorsorge sowie Erbschafts- und Schenkungssteuer (Natürliche Personen)',
                            isChecked: false,
                            additionalAttribute: 'data-tax_calc="inputEntity"',
                            validation: {
                              isRequired: true,
                            },
                            value: 'individuals',
                          })
                        ),
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            id: 'unternehmen',
                            groupName: 'taxEntity',
                            label: 'Unternehmen',
                            descr:
                              'Berechnen des Steuerbetrages und/oder der Steuerrückstellung für Kapitalgesellschaften, Genossenschaften und ausländische Personengesamtheiten (Juristische Personen I)',
                            additionalAttribute: 'data-tax_calc="inputEntity"',
                            validation: {
                              isRequired: true,
                            },
                            value: 'corporations',
                          })
                        ),
                      () =>
                        handlebars.compile(radioHBS)(
                          _.merge({}, radioData.variants.default.props, {
                            id: 'vereine_stiftungen',
                            groupName: 'taxEntity',
                            label: 'Vereine und Stiftungen',
                            descr:
                              'Berechnen des Steuerbetrages und/oder der Steuerrückstellung für Vereine, Stiftungen und übrige juristische Personen (Juristische Personen II)',
                            additionalAttribute: 'data-tax_calc="inputEntity"',
                            validation: {
                              isRequired: true,
                            },
                            value: 'associations',
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
