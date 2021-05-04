const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const formFieldsetHBS = dataHelper.getFileContent('../form/_form.fieldset.hbs');
const resultStepHBS = dataHelper.getFileContent('_result.step.hbs');

const formInputHBS = dataHelper.getFileContent('../../atoms/form_input/form_input.hbs');
const formInputData = require('../../atoms/form_input/form_input.data');

const accordionHBS = dataHelper.getFileContent('../accordion/accordion.hbs');
const accordionData = require('../accordion/accordion.data');

const radioHBS = dataHelper.getFileContent('../../atoms/radiobutton/radiobutton.hbs');
const radioData = require('../../atoms/radiobutton/radiobutton.data');

const datepickerHBS = dataHelper.getFileContent('../datepicker/datepicker.hbs');
const datepickerData = require('../datepicker/datepicker.data');

const template = dataHelper.getFileContent('decision_tree.hbs');

const markdownHbs = dataHelper.getDocumentation('decision_tree.md').replace(/\{\{(.*?)\}\}/g, (m) => {
  return m.replace(/&gt;/g, '>').replace(/&quot;/g, '"');
});
const markdownData = {
  decisionTreeDiagram: {
    srcsets: [{
      image: '/preview/assets/media/image/decisiontree.jpg',
      imageWidth: 1280,
    }],
    alt: 'Entscheidungsbaum Diagramm',
    isWide: true,
    caption: {
      caption: 'Diagramm des dargestellten Entscheidungsbaums',
    },
  },
};

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Entscheidungsbaum',
    className: 'DecisionTree',
    jira: 'CZHDEV-2845',
    documentation: handlebars.compile(markdownHbs)(markdownData),
    label: 'Formular',
  },
  props: {
    title: 'Einbürgerungs-Assistent',
    intro: 'Unser Assistent stellt Ihnen Schritt für Schritt Fragen. Beantworten Sie diese und finden Sie heraus, welche Art der Einbürgerung für Sie gilt:',
    editButton: {
      text: 'Anpassen',
      additionalClasses: 'mdl-decision_tree__navigation-edit',
      icon: 'edit',
      isSecondary: true,
      isSmall: true,
      isTagButton: true,
      isTextVisible: true,
    },
    stepper: {
      title: null,
      action: null,
      confirmation: null,
      navigation: null,
      toggle: null,
      notificationTemplate: null,
      ruleNotification: null,
      replyTo: null,
      noControls: true,
      disableScroll: true,
      footerButton: {
        text: 'Weiter',
        additionalClasses: 'mdl-decision_tree__next',
        icon: 'arrow-down',
        isTextVisible: true,
      },
      // data
      steps: [
        {
          headingLevel: 3,
          groups: [
            {
              rows: [
                {
                  fields: [
                    {
                      cellTitle: 'Wie lange leben Sie schon in der Schweiz?',
                      cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
                        formInputData.variants.default.props,
                        {
                          name: 'duration_of_stay',
                          uuid: 'duration_of_stay',
                          isFloatingLabel: true,
                          label: 'Aufenthaltsdauer in Jahren',
                          validation: {
                            pattern: '^([0-9]){1,2}$',
                            ariaTextValid: 'Eingabe entspricht den Vorgaben.',
                            ariaTextInvalid: 'Eingabe entspricht nicht den Vorgaben.',
                            errorMsg: 'Dieses Eingabefeld erlaubt nur Zahlen.',
                            isRequired: true,
                          },
                        })),
                    },
                  ],
                },
                {
                  fields: [
                    {
                      cellTitle: 'Haben sie früher schon einmal in der Schweiz gelebt?',
                      cellContent: () => handlebars.compile(formFieldsetHBS)({
                        requiredMessage: 'Bitte wählen Sie eine Option',
                        options: [
                          () => handlebars.compile(radioHBS)(_.merge({},
                            radioData.variants.default.props,
                            {
                              label: 'Ja',
                              groupName: 'live_before',
                              id: 'live_before_a',
                              value: 'ja',
                              validation: {
                                isRequired: true,
                              },
                            })),
                          () => handlebars.compile(radioHBS)(_.merge({},
                            radioData.variants.default.props,
                            {
                              label: 'Nein',
                              groupName: 'live_before',
                              id: 'live_before_b',
                              value: 'nein',
                              validation: {
                                isRequired: true,
                              },
                            })),
                        ],
                      }),
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          headingLevel: 3,
          rules: JSON.stringify([
            {
              conditions: [
                {
                  field: 'duration_of_stay',
                  compare: 'greaterEqual',
                  value: '5',
                },
              ],
              action: 'enable',
            },
          ]),
          groups: [
            {
              rows: [
                {
                  fields: [
                    {
                      cellTitle: 'Haben Sie eine Niederlassungsbewilligung C?',
                      cellContent: () => handlebars.compile(formFieldsetHBS)({
                        requiredMessage: 'Bitte wählen Sie eine Option',
                        options: [
                          () => handlebars.compile(radioHBS)(_.merge({},
                            radioData.variants.default.props,
                            {
                              label: 'Ja',
                              groupName: 'c_permit_group',
                              id: 'c_permit_1',
                              value: 'ja',
                              validation: {
                                isRequired: true,
                              },
                            })),
                          () => handlebars.compile(radioHBS)(_.merge({},
                            radioData.variants.default.props,
                            {
                              label: 'Nein',
                              groupName: 'c_permit_group',
                              id: 'c_permit_2',
                              value: 'nein',
                              validation: {
                                isRequired: true,
                              },
                            })),
                        ],
                      }),
                      cellAttachment: () => `
                          <figure class="mdl-image-figure">
                            <div class="mdl-image-figure__img-wrapper">
                              <img class="mdl-image-figure__img" src="../../assets/media/image/content_768_x15.jpeg" srcset="../../assets/media/image/content_768_x15.jpeg 1152w, ../../assets/media/image/content_444_x15.jpeg 666w" sizes="100vw" alt="Das ist ein Beispielbild" data-image-figure="image" />
                            </div>
                            <figcaption class="mdl-image-figure__caption">
                              <span class="atm-figcaption" data-figcaption="caption">
                                Das ist ein Bild, Quelle: Fotograf Andreas Andreasen
                              </span>
                            </figcaption>
                          </figure>`,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          headingLevel: 3,
          rules: JSON.stringify([
            {
              conditions: [
                {
                  field: 'c_permit_group',
                  equals: true,
                  value: 'ja',
                },
              ],
              action: 'enable',
            },
          ]),
          groups: [
            {
              rows: [
                {
                  fields: [
                    {
                      cellTitle: 'Sind Sie mit einem Schweizer oder einer Schweizerin verheiratet oder in eingetragener Partnerschaft?',
                      cellContent: () => handlebars.compile(formFieldsetHBS)({
                        requiredMessage: 'Bitte wählen Sie eine Option',
                        options: [
                          () => handlebars.compile(radioHBS)(_.merge({},
                            radioData.variants.default.props,
                            {
                              label: 'Ja',
                              groupName: 'partnered_ch',
                              id: 'partnered_ch_1',
                              value: 'ja',
                              validation: {
                                isRequired: true,
                              },
                            })),
                          () => handlebars.compile(radioHBS)(_.merge({},
                            radioData.variants.default.props,
                            {
                              label: 'Nein',
                              groupName: 'partnered_ch',
                              id: 'partnered_ch_2',
                              value: 'nein',
                              validation: {
                                isRequired: true,
                              },
                            })),
                        ],
                      }),
                      cellAttachment: () => `
                          <div class="mdl-richtext">
                            <h3 class="atm-heading">Test titel</h3>
                            <p class="atm-paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation</p>
                            <ul>
                              <li>P, Helvetic Roman Interessierte können ab sofort die Genauigkeit ihrer Smartphones und Navigationsgeräte überprüfen.</li>
                              <li>Koordinaten begegnen uns täglich. <ul>
                                  <li>P, Helvetic Roman Interessierte können ab sofort die Genauigkeit ihrer Smartphones und Navigationsgeräte überprüfen.</li>
                                  <li>Die Baudirektion hat beim Landesmuseum in Zürich einen Kontrollpunkt beim Landesmuseum in Zürich einen Kontrollpunkt.</li>
                                </ul>
                              </li>
                            </ul>
                          </div>`,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          headingLevel: 3,
          rules: JSON.stringify([
            {
              conditions: [
                {
                  field: 'partnered_ch',
                  equals: true,
                  value: 'ja',
                },
              ],
              action: 'enable',
            },
          ]),
          groups: [
            {
              rows: [
                {
                  fields: [
                    {
                      cellTitle: 'Seit wann sind Sie verheiratet oder in eingetragener Partnerschaft?',
                      cellContent: () => handlebars.compile(datepickerHBS)(_.merge({},
                        datepickerData.variants.defaultDate.props,
                        {
                          formInputData: _.merge({}, formInputData.variants.default.props, {
                            label: 'Datum der Eintragung',
                            uuid: 'duration_of_partnership',
                            name: 'duration_of_partnership',
                            validation: {
                              pattern: '^\\d{2}\\.\\d{2}\\.\\d{4}$',
                              isRequired: true,
                              ariaTextValid: 'Eingabe entspricht den Vorgaben.',
                              ariaTextInvalid: 'Eingabe entspricht nicht den Vorgaben.',
                              errorMsg: 'Bitte geben Sie eine gültiges Datum an.',
                            },
                          }),
                        })),
                      cellAttachment: () => handlebars.compile(accordionHBS)(_.merge({},
                        accordionData.variants.singleItem.props)),
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          endpoint: true,
          rules: JSON.stringify([
            {
              conditions: [
                {
                  field: 'duration_of_partnership',
                  compare: 'less',
                  compareAge: true,
                  value: '3',
                },
              ],
              action: 'enable',
            },
          ]),
          page: () => handlebars.compile(resultStepHBS)({
            headingLevel: 3,
            heading: 'Sie können sich einbürgern lassen.',
            text: {
              leadText: 'Für Sie gilt die erleichterte Einbürgerung. Weil Sie ...',
            },
            params: [
              'seit mehr als 5 Jahren in der Schweiz leben.',
              'und eine Niederlassungsbewilligung C besitzen.',
              'und seit mehr als 3 Jahren mit einer Schweizerin oder einem Schweizer verheiratet sind oder in eingetragener Partnerschaft zusammen leben.',
            ],
            serviceList: {
              hasHeading: false,
              items: [
                {
                  title: 'Erleichterte Einbürgerung beantragen',
                  buttonTitle: 'Start',
                  href: '../../pages/service/service.html',
                  external: true,
                },
              ],
            },
          }),
        },
        {
          endpoint: true,
          rules: JSON.stringify([
            {
              conditions: [
                {
                  field: 'duration_of_stay',
                  compare: 'greaterEqual',
                  value: '10',
                },
                {
                  field: 'c_permit_group',
                  equals: true,
                  value: 'ja'
                },
              ],
              action: 'enable',
            },
          ]),
          page: () => handlebars.compile(resultStepHBS)({
            headingLevel: 3,
            heading: 'Sie können sich einbürgern lassen.',
            text: {
              leadText: 'Für Sie gilt die ordentliche Einbürgerung. Weil Sie ...',
            },
            params: [
              'Seit mehr als 10 Jahren in der Schweiz leben.',
              'und eine Niederlassungsbewilligung C besitzen.',
            ],
            serviceList: {
              hasHeading: false,
              items: [
                {
                  title: 'Ordentliche Einbürgerung beantragen',
                  buttonTitle: 'Start',
                  href: '../../pages/service/service.html',
                  external: true,
                },
              ],
            },
          }),
        },
        {
          endpoint: true,
          page: () => handlebars.compile(resultStepHBS)({
            headingLevel: 3,
            heading: 'Sie können sich nicht einbürgern lassen.',
            text: {
              leadText: 'Für Sie ist die Einbürgerung derzeit nicht mögliche weil Sie entweder...',
            },
            params: [
              'nicht seit mehr als 10 Jahren in der Schweiz leben.',
              'oder nicht seit mehr als 5 Jahren in der Schweiz leben und seit mehr als 3 Jahren mit einer Schweizerin oder einem Schweizer verheiratet sind oder in eingetragener Partnerschaft zusammen leben.',
              'oder keine Niederlassungsbewilligung C besitzen.',
            ],
          }),
        },
      ],
    },
  },
});

const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
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
