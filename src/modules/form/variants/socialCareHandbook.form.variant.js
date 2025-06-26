const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');

const formInputHBS = dataHelper.getFileContent('../../../atoms/form_input/form_input.hbs');
const formInputData = require('../../../atoms/form_input/form_input.data');

const drillDownSelectHBS = dataHelper.getFileContent('../../drilldown_select/drilldown_select.hbs');
const drillDownSelectData = require('../../drilldown_select/drilldown_select.data');

module.exports = {
  meta: {
    title: 'Sozialhilfe Handbuch (Flex data CZHDEV-3005)',
    desc: 'Flex Data für das Sozialhilfe Handbuch',
  },
  props: {
    sectionTitle: 'Im Handbuch suchen',
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
                      isFloatingLabel: true,
                      label: 'Stichwort',
                      name: 'fullText',
                      uuid: 'fullTextSocialCare',
                      hint: 'Komplexe Suchanfragen können mit "" gestellt werden. Bspw. "§ 16 Abs. 2 SHV"',
                    })
                  ),
              },
            ],
          },
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(drillDownSelectHBS)(
                    _.merge({}, drillDownSelectData.variants.default.props, {
                      // primary secondary
                      primarySelectData: {
                        listData: {
                          groupId: 'themaSocialCare',
                        },
                        triggerInputData: {
                          label: 'Kapitel',
                          name: 'chapter',
                          uuid: 'chapterSocialCare',
                        },
                      },
                      secondarySelectData: {
                        listData: {
                          groupId: 'unterthemaSocialCare',
                        },
                        triggerInputData: {
                          label: 'Unterkapitel',
                          name: 'subChapter',
                          uuid: 'subChapterSocialCare',
                        },
                      },
                    })
                  ),
              },
            ],
            unwrapped: true,
          },
          {
            fields: [
              {
                cellContent: () =>
                  handlebars.compile(formInputHBS)(
                    _.merge({}, formInputData.variants.floatValidateHint.props, {
                      isFloatingLabel: true,
                      label: 'Publikationsdatum',
                      name: 'publication-date',
                      uuid: 'publication-date-social-care',
                      inputMask: '\\d\\d\\.[\\d.]\\d\\d[\\d.]\\.[\\d.]\\d\\d\\d\\d[\\d.]',
                      maskPlaceholder: 'TT.MM.YYYY',
                      hint: false,
                      usedCustomIcon: true,
                      validation: {
                        pattern: '^\\d{2}\\.\\d{2}\\.\\d{4}$',
                        ariaTextValid: 'Eingabe entspricht den Vorgaben.',
                        ariaTextInvalid: 'Eingabe entspricht nicht den Vorgaben.',
                        errorMsg: 'Datum bitte im Format TT.MM.YYYY eingeben!',
                        isRequired: false,
                      },
                    })
                  ),
              },
              {
                cellContent: () =>
                  handlebars.compile(formInputHBS)(
                    _.merge({}, formInputData.variants.floatValidateHint.props, {
                      isFloatingLabel: true,
                      label: 'Gültig seit',
                      name: 'valide-since-date',
                      uuid: 'valide-since-date-social-care',
                      inputMask: '\\d\\d\\.[\\d.]\\d\\d[\\d.]\\.[\\d.]\\d\\d\\d\\d[\\d.]',
                      maskPlaceholder: 'TT.MM.YYYY',
                      usedCustomIcon: true,
                      hint: false,
                      validation: {
                        pattern: '^\\d{2}\\.\\d{2}\\.\\d{4}$',
                        ariaTextValid: 'Eingabe entspricht den Vorgaben.',
                        ariaTextInvalid: 'Eingabe entspricht nicht den Vorgaben.',
                        errorMsg: 'Datum bitte im Format TT.MM.YYYY eingeben!',
                        isRequired: false,
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
