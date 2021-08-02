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

  },
});

const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
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
                                id: 'c_permit_group_1',
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
                                id: 'c_permit_group_2',
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
  },
  complex: {
    meta: {
      title: 'Komplex',
      desc: '',
    },
    props: {
      title: 'Kann ich mich einbürgern lassen?',
      intro: '<p class="atm-paragraph">Nach der Beantworung der folgenden Fragen erfahren Sie, ob...  </p><p class="atm-paragraph">Erfüllen Sie die Voraussetzungen für eine ordentliche oder erleichterte Einbürgerung? Sie können es mit dem Einbürgerungs-Checker herausfinden.</p>',
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
          // 1 - Aufenthaltsdauer
          {
            headingLevel: 3,
            groups: [
              {
                rows: [
                  {
                    fields: [
                      {
                        cellTitle: 'Wie lange leben Sie  in der Schweiz?',
                        cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
                          formInputData.variants.default.props,
                          {
                            name: 'aufenthaltsdauer',
                            uuid: 'aufenthaltsdauer',
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
                ],
              },
            ],
          },
          // 2 - Zivilstand
          {
            headingLevel: 3,
            groups: [
              {
                rows: [
                  {
                    fields: [
                      {
                        cellTitle: 'Sind Sie mit einem Schweizer oder einer Schweizerin verheiratet oder in einer eingetragener Partnerschaft?',
                        cellContent: () => handlebars.compile(formFieldsetHBS)({
                          requiredMessage: 'Bitte wählen Sie eine Option',
                          options: [
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                label: 'Nein',
                                groupName: 'zivilstand',
                                id: 'civil_status_a',
                                value: 'ledig',
                                validation: {
                                  isRequired: true,
                                },
                              })),
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                label: 'Ja verheiratet',
                                groupName: 'zivilstand',
                                id: 'civil_status_b',
                                value: 'verheiratet',
                                validation: {
                                  isRequired: true,
                                },
                              })),
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                label: 'Ja in eingetragener Partnerschaft',
                                groupName: 'zivilstand',
                                id: 'civil_status_c',
                                value: 'partnerschaft',
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
          // 3a - Dauer der Ehe >= 3
          {
            headingLevel: 3,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'zivilstand',
                    equals: true,
                    value: 'verheiratet',
                  },
                  {
                    field: 'aufenthaltsdauer',
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
                        cellTitle: 'Sind Sie seit mindestens 3 Jahren mit einem Schweizer oder einer Schweizerin verheiratet?',
                        cellContent: () => handlebars.compile(formFieldsetHBS)({
                          requiredMessage: 'Bitte wählen Sie eine Option',
                          options: [
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                label: 'Nein',
                                groupName: 'verheirated3plus',
                                id: 'verheirated3plus_a',
                                value: 'nein',
                                validation: {
                                  isRequired: true,
                                },
                              })),
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                label: 'Ja',
                                groupName: 'verheirated3plus',
                                id: 'verheirated3plus_b',
                                value: 'ja',
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
          // 3b - Dauer der Ehe >= 6
          {
            headingLevel: 3,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'zivilstand',
                    equals: true,
                    value: 'verheiratet',
                  },
                  {
                    field: 'aufenthaltsdauer',
                    compare: 'less',
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
                        cellTitle: 'Sind Sie seit mindestens 6 Jahren mit einem Schweizer oder einer Schweizerin verheiratet?',
                        cellContent: () => handlebars.compile(formFieldsetHBS)({
                          requiredMessage: 'Bitte wählen Sie eine Option',
                          options: [
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                label: 'Nein',
                                groupName: 'verheirated6plus',
                                id: 'verheirated6plus_a',
                                value: 'nein',
                                validation: {
                                  isRequired: true,
                                },
                              })),
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                label: 'Ja',
                                groupName: 'verheirated6plus',
                                id: 'verheirated6plus_b',
                                value: 'ja',
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
          // Endpoint 3a true
          {
            endpoint: true,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'zivilstand',
                    equals: true,
                    value: 'verheiratet',
                  },
                  {
                    field: 'verheirated6plus',
                    equals: true,
                    value: 'ja',
                  },
                ],
                action: 'enable',
              },
            ]),
            page: () => handlebars.compile(resultStepHBS)({
              headingLevel: 3,
              heading: 'Ja.',
              text: {
                leadText: 'Erleichterte Einbürgerung BüG Art. 21 Abs. 2 möglich',
              },
              params: [
                'Sie sind seit mindestens 6 Jahren mit einem Schweizer oder einer Schweizerin verheiratet.',
              ],
            }),
          },
          // Endpoint 3a false
          {
            endpoint: true,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'aufenthaltsdauer',
                    compare: 'less',
                    value: '5',
                  },
                  {
                    field: 'zivilstand',
                    equals: true,
                    value: 'verheiratet',
                  },
                  {
                    field: 'verheirated3plus',
                    equals: true,
                    value: 'ja',
                  },
                  {
                    field: 'verheirated6plus',
                    equals: true,
                    value: 'nein',
                  },
                ],
                action: 'enable',
              },
            ]),
            page: () => handlebars.compile(resultStepHBS)({
              headingLevel: 3,
              heading: 'Nein.',
              text: {
                leadText: 'Eine Einbürgerung ist nicht möglich.',
              },
              params: [
                'Sie sind noch nicht 6 Jahre mit einer Schweizerin oder einem Schweizer verheiratet.',
              ],
            }),
          },
          // Endpoint 3b true
          {
            endpoint: true,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'aufenthaltsdauer',
                    compare: 'greaterEqual',
                    value: '5',
                  },
                  {
                    field: 'zivilstand',
                    equals: true,
                    value: 'verheiratet',
                  },
                  {
                    field: 'verheirated3plus',
                    equals: true,
                    value: 'ja',
                  },
                ],
                action: 'enable',
              },
            ]),
            page: () => handlebars.compile(resultStepHBS)({
              headingLevel: 3,
              heading: 'Ja.',
              text: {
                leadText: 'Eine erleichterte Einbürgerung ist möglich.',
              },
              params: [
                'Sie leben seit mindestens 5 Jahre in der Schweiz.',
                'Sie sind seit mindestens 3 Jahren mit einer Schweizerin oder einem Schweizer verheiratet.',
              ],
            }),
          },
          // Endpoint 2 nicht verheiratet und weniger als 5 jahre in der schweiz
          {
            endpoint: true,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'aufenthaltsdauer',
                    compare: 'less',
                    equals: true,
                    value: '5',
                  },
                ],
                action: 'enable',
              },
            ]),
            page: () => handlebars.compile(resultStepHBS)({
              headingLevel: 3,
              heading: 'Nein.',
              text: {
                leadText: 'Sie können sich derzeit nicht eibürgern lassen...',
              },
              params: [
                'Sie leben weniger als 5 Jahre in der Schweiz. Allfällige frühere Aufenthalte sind dabei nicht berücksichtigt.',
              ],
            }),
          },
          // 4 - C Bewilligung
          {
            headingLevel: 3,
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
                                groupName: 'c_permit',
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
                                groupName: 'c_permit',
                                id: 'c_permit_2',
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
          // 5 - Alter
          {
            headingLevel: 3,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'aufenthaltsdauer',
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
                        cellTitle: 'Wie alt sind Sie?',
                        cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
                          formInputData.variants.default.props,
                          {
                            name: 'alter',
                            uuid: 'alter',
                            isFloatingLabel: true,
                            label: 'Alter in Jahren',
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
                ],
              },
            ],
          },
          // 6 - Dauer Eingetragene Partnerschaft >= 3
          {
            headingLevel: 3,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'c_permit',
                    equals: true,
                    value: 'ja',
                  },
                  {
                    field: 'zivilstand',
                    equals: true,
                    value: 'partnerschaft',
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
                        cellTitle: 'Sind Sie seit mindestens 3 Jahren mit einem Schweizer oder einer Schweizerin in einer eingetragenen Partnerschaft?',
                        cellContent: () => handlebars.compile(formFieldsetHBS)({
                          requiredMessage: 'Bitte wählen Sie eine Option',
                          options: [
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                label: 'Ja',
                                groupName: 'partnerschaft3plus',
                                id: 'partnerschaft3plus_1',
                                value: 'ja',
                                validation: {
                                  isRequired: true,
                                },
                              })),
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                label: 'Nein',
                                groupName: 'partnerschaft3plus',
                                id: 'partnerschaft3plus_2',
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
          // 7 - Sind Ihre Grosseltern in der Schweiz geboren oder haben sie ein Aufenthaltsrecht erworben?
          {
            headingLevel: 3,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'c_permit',
                    equals: true,
                    value: 'ja',
                  },
                  {
                    field: 'zivilstand',
                    equals: false,
                    value: 'partnerschaft',
                  },
                  {
                    field: 'alter',
                    compare: 'lessEqual',
                    value: '25',
                  },
                ],
                action: 'enable',
              },
              {
                conditions: [
                  {
                    field: 'c_permit',
                    equals: true,
                    value: 'ja',
                  },
                  {
                    field: 'partnerschaft3plus',
                    equals: true,
                    value: 'nein',
                  },
                  {
                    field: 'alter',
                    compare: 'lessEqual',
                    value: '25',
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
                        cellTitle: 'Sind Ihre Grosseltern in der Schweiz geboren oder haben sie ein Aufenthaltsrecht erworben?',
                        cellContent: () => handlebars.compile(formFieldsetHBS)({
                          requiredMessage: 'Bitte wählen Sie eine Option',
                          options: [
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                label: 'Ja',
                                groupName: 'grosseltern_schweiz',
                                id: 'grosseltern_schweiz_1',
                                value: 'ja',
                                validation: {
                                  isRequired: true,
                                },
                              })),
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                label: 'Nein',
                                groupName: 'grosseltern_schweiz',
                                id: 'grosseltern_schweiz_2',
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
          // 8 - Hat mindestens eines Ihrer Elternteile eine Niederlassungsbewilligung erworben, 10 Jahre in der Schweiz gelebt und mindestens 5 Jahre die obligatorische Schule in der Schweiz besucht?
          {
            headingLevel: 3,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'grosseltern_schweiz',
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
                        cellTitle: 'Hat mindestens eines Ihrer Elternteile eine Niederlassungsbewilligung erworben, 10 Jahre in der Schweiz gelebt und mindestens 5 Jahre die obligatorische Schule in der Schweiz besucht?',
                        cellContent: () => handlebars.compile(formFieldsetHBS)({
                          requiredMessage: 'Bitte wählen Sie eine Option',
                          options: [
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                label: 'Ja',
                                groupName: 'eltern_bewilligung',
                                id: 'eltern_bewilligung_1',
                                value: 'ja',
                                validation: {
                                  isRequired: true,
                                },
                              })),
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                label: 'Nein',
                                groupName: 'eltern_bewilligung',
                                id: 'eltern_bewilligung_2',
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
          // 9 - Sind Sie in der Schweiz geboren?
          {
            headingLevel: 3,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'eltern_bewilligung',
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
                        cellTitle: 'Sind Sie in der Schweiz geboren?',
                        cellContent: () => handlebars.compile(formFieldsetHBS)({
                          requiredMessage: 'Bitte wählen Sie eine Option',
                          options: [
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                label: 'Ja',
                                groupName: 'geboren_ch',
                                id: 'geboren_ch_1',
                                value: 'ja',
                                validation: {
                                  isRequired: true,
                                },
                              })),
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                label: 'Nein',
                                groupName: 'geboren_ch',
                                id: 'geboren_ch_2',
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
          // 10 - Haben Sie während fünf Jahren die obligatorische Schule in der Schweiz besucht?
          {
            headingLevel: 3,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'geboren_ch',
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
                        cellTitle: 'Haben Sie während fünf Jahren die obligatorische Schule in der Schweiz besucht?',
                        cellContent: () => handlebars.compile(formFieldsetHBS)({
                          requiredMessage: 'Bitte wählen Sie eine Option',
                          options: [
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                label: 'Ja',
                                groupName: 'schule_5_ch',
                                id: 'schule_5_ch_1',
                                value: 'ja',
                                validation: {
                                  isRequired: true,
                                },
                              })),
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                label: 'Nein',
                                groupName: 'schule_5_ch',
                                id: 'schule_5_ch_2',
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
          // Endpoint 10 Haben Sie während fünf Jahren die obligatorische Schule in der Schweiz besucht
          {
            endpoint: true,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'schule_5_ch',
                    equals: true,
                    value: 'ja',
                  },
                ],
                action: 'enable',
              },
            ]),
            page: () => handlebars.compile(resultStepHBS)({
              headingLevel: 3,
              heading: 'Ja.',
              text: {
                leadText: 'Eine erleichterte Einbürgerung ist möglich.',
              },
              params: [
                'Sie besitzen eine Niederlassungsbewilligung C.',
                'Sie sind jünger als 26 Jahre.',
                'Ihre Grosseltern wurden in der Schweiz geboren oder haben ein Aufenthaltsrecht erworben.',
                'Mindestens eines Ihrer Elternteile hat eine Niederlassungsbewilligung erworben, lebte 10 Jahre in der Schweiz und hat mindestens 5 Jahre die obligatorische Schule in der Schweiz besucht.',
                'Sie wurden in der Schweiz geboren.',
                'Rechtsgrundlage BüG Art. 24a',
              ],
            }),
          },
          // 11 - Haben sich Ihre Eltern einbürgern lassen als Sie minderjährig waren und Sie nicht ins Gesuch miteinbezogen?
          {
            headingLevel: 3,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'alter',
                    compare: 'less',
                    value: '22',
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
                        cellTitle: 'Haben sich Ihre Eltern einbürgern lassen als Sie minderjährig waren und Sie nicht ins Gesuch miteinbezogen?',
                        cellContent: () => handlebars.compile(formFieldsetHBS)({
                          requiredMessage: 'Bitte wählen Sie eine Option',
                          options: [
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                label: 'Ja',
                                groupName: 'eltern_eingebuergert',
                                id: 'eltern_eingebuergert_1',
                                value: 'ja',
                                validation: {
                                  isRequired: true,
                                },
                              })),
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                label: 'Nein',
                                groupName: 'eltern_eingebuergert',
                                id: 'eltern_eingebuergert_2',
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
          // Endpoint 11 Haben sich Ihre Eltern einbürgern lassen als Sie minderjährig waren und Sie nicht ins Gesuch miteinbezogen
          {
            endpoint: true,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'eltern_eingebuergert',
                    equals: true,
                    value: 'ja',
                  },
                ],
                action: 'enable',
              },
            ]),
            page: () => handlebars.compile(resultStepHBS)({
              headingLevel: 3,
              heading: 'Ja.',
              text: {
                leadText: 'Eine erleichterte Einbürgerung ist möglich.',
              },
              params: [
                'Sie sind jünger als 22 Jahre.',
                'Ihre Eltern liesen sich einbürgern als Sie minderjährig waren und haben Sie nicht ins Gesuch miteinbezogen.',
                'Rechtsgrundlage BüG Art. 24',
              ],
            }),
          },
          // 12 - Sind sie staatenlos?
          {
            headingLevel: 3,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'eltern_eingebuergert',
                    equals: true,
                    value: 'nein',
                  },
                  {
                    field: 'alter',
                    compare: 'less',
                    value: '18',
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
                        cellTitle: 'Sind Sie staatenlos?',
                        cellContent: () => handlebars.compile(formFieldsetHBS)({
                          requiredMessage: 'Bitte wählen Sie eine Option',
                          options: [
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                label: 'Ja',
                                groupName: 'staatenlos',
                                id: 'staatenlos_1',
                                value: 'ja',
                                validation: {
                                  isRequired: true,
                                },
                              })),
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                label: 'Nein',
                                groupName: 'staatenlos',
                                id: 'staatenlos_2',
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
          // Endpoint 12 Sind sie staatenlos ja
          {
            endpoint: true,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'staatenlos',
                    equals: true,
                    value: 'ja',
                  },
                ],
                action: 'enable',
              },
            ]),
            page: () => handlebars.compile(resultStepHBS)({
              headingLevel: 3,
              heading: 'Ja.',
              text: {
                leadText: 'Eine erleichterte Einbürgerung ist möglich.',
              },
              params: [
                'Sie sind jünger als 18 Jahre.',
                'Ihre Eltern liesen sich einbürgern als Sie minderjährig waren und haben Sie nicht ins Gesuch miteinbezogen.',
                'Rechtsgrundlage BüG Art. 24',
              ],
            }),
          },
          // Endpoint no C Permit
          {
            endpoint: true,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'c_permit',
                    equals: true,
                    value: 'nein',
                  },
                  {
                    field: 'alter',
                    compare: 'greater',
                    value: '21',
                  },
                ],
                action: 'enable',
              },
            ]),
            page: () => handlebars.compile(resultStepHBS)({
              headingLevel: 3,
              heading: 'Nein.',
              text: {
                leadText: 'Sie können sich derzeit nicht Einbürgern lassen',
              },
              params: [
                'Sie besitzen keine Niederlassungsbewilligung C',
                'Sie sind nicht mit einem Schweizer oder einer Schweizerin verheirat bzw. noch nicht 3 Jahre.',
                'Sie sind älter als 21 Jahre oder können nicht einer erleichterten Einbürgerung für Kinder und junge Erwachsene profitieren',
              ],
            }),
          },
          // Endpoint no partnership und weniger als 6 jahre
          {
            endpoint: true,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'c_permit',
                    equals: true,
                    value: 'ja',
                  },
                  {
                    field: 'partnerschaft3plus',
                    equals: true,
                    value: 'nein',
                  },
                  {
                    field: 'alter',
                    compare: 'greater',
                    value: '24',
                  },
                  {
                    field: 'aufenthaltsdauer',
                    compare: 'less',
                    value: '6',
                  },
                ],
                action: 'enable',
              },
              {
                conditions: [
                  {
                    field: 'c_permit',
                    equals: true,
                    value: 'ja',
                  },
                  {
                    field: 'zivilstand',
                    equals: true,
                    value: 'ledig',
                  },
                  {
                    field: 'alter',
                    compare: 'greater',
                    value: '24',
                  },
                  {
                    field: 'aufenthaltsdauer',
                    compare: 'less',
                    value: '6',
                  },
                ],
                action: 'enable',
              },
            ]),
            page: () => handlebars.compile(resultStepHBS)({
              headingLevel: 3,
              heading: 'Nein.',
              text: {
                leadText: 'Sie können sich derzeit nicht Einbürgern lassen',
              },
              params: [
                'Sie leben noch nicht seit 6 Jahren in der Schweiz. Allfällige frühere Aufenthalte sind dabei nicht berücksichtigt.',
                'Sie sind nicht mit einem Schweizer oder einer Schweizerin verheiratet oder in Eingetragener Partnerschaft bzw. noch nicht 3 Jahre.',
                'Sie sind älter als 24 Jahre oder können nicht von einer erleichterten Einbürgerung für Kinder und junge Erwachsene profitieren.',
              ],
            }),
          },
          // 14 - Anrechenbare Jahre
          {
            headingLevel: 3,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'aufenthaltsdauer',
                    compare: 'greaterEqual',
                    value: '6',
                  },
                  {
                    field: 'c_permit',
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
                        cellTitle: 'Berechnen Sie bitte Ihre anrechenbaren Jahre',
                        cellContent: () => handlebars.compile(formInputHBS)(_.merge({},
                          formInputData.variants.default.props,
                          {
                            name: 'anr_jahre',
                            uuid: 'anr_jahre',
                            isFloatingLabel: true,
                            label: 'Anrechenbare Jahren',
                            validation: {
                              pattern: '^([0-9]){1,2}$',
                              ariaTextValid: 'Eingabe entspricht den Vorgaben.',
                              ariaTextInvalid: 'Eingabe entspricht nicht den Vorgaben.',
                              errorMsg: 'Dieses Eingabefeld erlaubt nur Zahlen.',
                              isRequired: true,
                            },
                          })),
                        cellAttachment: () => `
                           <div class="mdl-richtext ">
                            <h4 class="atm-heading" id="-2048751925">So berechen Sie die anrechenbaren Jahre:</h4>
                        <ul>
                         <li>Die Jahre zwischen 8. und 18. Geburtstag zählen doppelt.</li>
                         <li>Die restlichen Jahre zählen einfach.</li>
                         <li>Achtung: Es zählt nur der aktuelle Aufenthalt. Frühere Aufenthalte zählen nicht.</li>
                        </ul>
                        <h4 class="atm-heading" id="-1132981593"><span style="font-size: 20.0px;">Beispiel</span><br> </h4>
                        <p class="atm-paragraph">Jemand ist mit 6 Jahren in die Schweiz gekommen und heute 20 Jahre alt. Der Aufenthalt ist ohne Unterbruch.</p>
                        <ul>
                         <li>Die Jahre von 8 bis 18 zählen doppelt: 20 Jahre</li>
                         <li>Die Jahre von 6 bis 8 zählen einfach: 2 Jahre</li>
                         <li>Die Jahre von 18 bis 20 zählen einfach: 2 Jahre</li>
                        </ul>
                        <p class="atm-paragraph">Also ergeben sich 24 anrechenbare Jahre.</p>
                        </div>
                         `,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          // Endpoint no partnership und weniger als 10 jahre
          {
            endpoint: true,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'c_permit',
                    equals: true,
                    value: 'ja',
                  },
                  {
                    field: 'partnerschaft3plus',
                    equals: true,
                    value: 'nein',
                  },
                  {
                    field: 'alter',
                    compare: 'greater',
                    value: '24',
                  },
                  {
                    field: 'anr_jahre',
                    compare: 'less',
                    value: '10',
                  },
                ],
                action: 'enable',
              },
              {
                conditions: [
                  {
                    field: 'c_permit',
                    equals: true,
                    value: 'ja',
                  },
                  {
                    field: 'zivilstand',
                    equals: true,
                    value: 'ledig',
                  },
                  {
                    field: 'alter',
                    compare: 'greater',
                    value: '24',
                  },
                  {
                    field: 'anr_jahre',
                    compare: 'less',
                    value: '10',
                  },
                ],
                action: 'enable',
              },
            ]),
            page: () => handlebars.compile(resultStepHBS)({
              headingLevel: 3,
              heading: 'Nein.',
              text: {
                leadText: 'Sie können sich derzeit nicht Einbürgern lassen',
              },
              params: [
                'Sie leben noch nicht seit 10 Jahren in der Schweiz (Zeit zwischen dem 8. und 18. Geburtstag zählt doppelt). Allfällige frühere Aufenthalte sind dabei nicht berücksichtigt.',
                'Sie sind nicht mit einem Schweizer oder einer Schweizerin verheiratet oder in Eingetragener Partnerschaft bzw. noch nicht 3 Jahre.',
                'Sie sind älter als 24 Jahre oder können nicht von einer erleichterten Einbürgerung für Kinder und junge Erwachsene profitieren.',
              ],
            }),
          },
          // 13a - Wohnen Sie seit mindestens 2 Jahren in der gleichen Zürcher Gemeinde?
          {
            headingLevel: 3,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'anr_jahre',
                    compare: 'greaterEqual',
                    value: '10',
                  },
                  {
                    field: 'alter',
                    compare: 'greater',
                    value: '24',
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
                        cellTitle: 'Wohnen Sie seit mindestens 2 Jahren in der gleichen Zürcher Gemeinde?',
                        cellContent: () => handlebars.compile(formFieldsetHBS)({
                          requiredMessage: 'Bitte wählen Sie eine Option',
                          options: [
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                label: 'Ja',
                                groupName: 'gleiche_gemeinde',
                                id: 'gleiche_gemeinde_1',
                                value: 'ja',
                                validation: {
                                  isRequired: true,
                                },
                              })),
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                label: 'Nein',
                                groupName: 'gleiche_gemeinde',
                                id: 'gleiche_gemeinde_2',
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
          // Endpoint 13a false
          {
            endpoint: true,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'gleiche_gemeinde',
                    equals: true,
                    value: 'nein',
                  },
                ],
                action: 'enable',
              },
            ]),
            page: () => handlebars.compile(resultStepHBS)({
              headingLevel: 3,
              heading: 'Nein.',
              text: {
                leadText: 'Sie können sich derzeit nicht Einbürgern lassen',
              },
              params: [
                'Sie leben nicht seit mindestens 2 Jahren in der gleichen zürcher Gemeinde',
              ],
            }),
          },
          // Endpoint 13a true 1
          {
            endpoint: true,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'gleiche_gemeinde',
                    equals: true,
                    value: 'ja',
                  },
                  {
                    field: 'partnerschaft3plus',
                    equals: true,
                    value: 'ja',
                  },
                ],
                action: 'enable',
              },
            ]),
            page: () => handlebars.compile(resultStepHBS)({
              headingLevel: 3,
              heading: 'Ja.',
              text: {
                leadText: 'Eine ordentliche Einbürgerung ist möglich weil...',
              },
              params: [
                'Sie eine Niederlassungsbewilligung besitzen.',
                'Sie seit mindestens 3 Jahren in eingetragener Partnerschaft leben.',
                'Sie seit mindestens 2 Jahren in der gleichen Zürcher Gemeinde wohnen',
                'BüG. Art. 9',
              ],
            }),
          },
          // Endpoint 13a true 2
          {
            endpoint: true,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'gleiche_gemeinde',
                    equals: true,
                    value: 'ja',
                  },
                  {
                    field: 'zivilstand',
                    equals: true,
                    value: 'ledig',
                  },
                ],
                action: 'enable',
              },
            ]),
            page: () => handlebars.compile(resultStepHBS)({
              headingLevel: 3,
              heading: 'Ja.',
              text: {
                leadText: 'Eine ordentliche Einbürgerung ist möglich weil...',
              },
              params: [
                'Sie eine Niederlassungsbewilligung besitzen.',
                'Sie seit mindestens 10 Jahren in der Schweiz leben (Zeit zwischen dem 8. und 18. Geburtstag zählt doppelt).',
                'Sie seit mindestens 2 Jahren in der gleichen Zürcher Gemeinde wohnen.',
                'BüG. Art. 9',
              ],
            }),
          },
          // 13b - Wohnen Sie seit mindestens 2 Jahren im Kanton Zürich?
          {
            headingLevel: 3,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'anr_jahre',
                    compare: 'greaterEqual',
                    value: '10',
                  },
                  {
                    field: 'alter',
                    compare: 'lessEqual',
                    value: '24',
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
                        cellTitle: 'Wohnen Sie seit mindestens 2 Jahren im Kanton Zürich?',
                        cellContent: () => handlebars.compile(formFieldsetHBS)({
                          requiredMessage: 'Bitte wählen Sie eine Option',
                          options: [
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                label: 'Ja',
                                groupName: 'gleicher_kanton',
                                id: 'gleicher_kanton_1',
                                value: 'ja',
                                validation: {
                                  isRequired: true,
                                },
                              })),
                            () => handlebars.compile(radioHBS)(_.merge({},
                              radioData.variants.default.props,
                              {
                                label: 'Nein',
                                groupName: 'gleicher_kanton',
                                id: 'gleicher_kanton-2',
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
          // Endpoint 13b false
          {
            endpoint: true,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'gleicher_kanton',
                    equals: true,
                    value: 'nein',
                  },
                ],
                action: 'enable',
              },
            ]),
            page: () => handlebars.compile(resultStepHBS)({
              headingLevel: 3,
              heading: 'Nein.',
              text: {
                leadText: 'Sie können sich derzeit nicht Einbürgern lassen',
              },
              params: [
                'Sie leben nicht seit mindestens 2 Jahren im Kanton Zürich leben',
              ],
            }),
          },
          // Endpoint 13b true 1
          {
            endpoint: true,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'gleicher_kanton',
                    equals: true,
                    value: 'ja',
                  },
                  {
                    field: 'partnerschaft3plus',
                    equals: true,
                    value: 'ja',
                  },
                ],
                action: 'enable',
              },
            ]),
            page: () => handlebars.compile(resultStepHBS)({
              headingLevel: 3,
              heading: 'Ja.',
              text: {
                leadText: 'Eine ordentliche Einbürgerung ist möglich weil...',
              },
              params: [
                'Jünger als 25 Jahre sind.',
                'Sie eine Niederlassungsbewilligung besitzen.',
                'Sie seit mindestens 3 Jahren in eingetragener Partnerschaft leben.',
                'Sie seit mindestens 2 Jahren im Kanton Zürich wohnen',
                'BüG. Art. 9',
              ],
            }),
          },
          // Endpoint 13b true 2
          {
            endpoint: true,
            rules: JSON.stringify([
              {
                conditions: [
                  {
                    field: 'gleicher_kanton',
                    equals: true,
                    value: 'ja',
                  },
                  {
                    field: 'zivilstand',
                    equals: true,
                    value: 'ledig',
                  },
                ],
                action: 'enable',
              },
            ]),
            page: () => handlebars.compile(resultStepHBS)({
              headingLevel: 3,
              heading: 'Ja.',
              text: {
                leadText: 'Eine ordentliche Einbürgerung ist möglich weil...',
              },
              params: [
                'Sie eine Niederlassungsbewilligung besitzen.',
                'Sie seit mindestens 10 Jahren in der Schweiz leben (Zeit zwischen dem 8. und 18. Geburtstag zählt doppelt).',
                'Jünger als 25 Jahre sind.',
                'Sie seit mindestens 2 Jahren im Kanton Zürich wohnen.',
                'BüG. Art. 9',
              ],
            }),
          },
          // Generischer Endpunkt
          {
            endpoint: true,
            page: () => handlebars.compile(resultStepHBS)({
              headingLevel: 3,
              heading: 'Nein.',
              text: {
                leadText: 'Sie können sich derzeit nicht Einbürgern lassen',
              },
              params: [
                'Ihre Angaben entsprechen keinen passenden Kriterien',
              ],
            }),
          },
        ],
      },
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
