const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const defAccordionData = require('../accordion/accordion.data.js');
const defButtonData = require('../../atoms/button/button.data.js');
const defaultFormData = require('../form/form.data.js');

const template = dataHelper.getFileContent('dialog.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Dialog',
    className: 'Dialog',
    jira: 'CZHDEV-3502',
    label: 'Container',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    preview: true,
    footerButtons: [
      _.merge({}, defButtonData.variants.default.props, {
        type: 'submit',
        text: 'Anwenden',
        isBig: true,
        additionalAttribute: 'data-dialog="submit"',
      }),
      _.merge({}, defButtonData.variants.secondary.props, {
        type: 'reset',
        text: 'Zurücksetzen',
        isBig: true,
        additionalAttribute: 'data-dialog="reset"',
      }),
    ],
  },
});
const variants = _.mapValues(
  {
    default: {
      meta: {
        title: 'Massnahmen-Suche',
        desc: 'Suche für Massnahmen in der Regierungsplattform',
      },
      props: {
        dialogId: _.uniqueId('dialog-'),
        dialogTitle: 'Erweiterte Suche',
        closeButtonLabel: 'Schliessen',
        modules: {
          contentModules: [
            () =>
              handlebars.compile(dataHelper.getFileContent('../accordion/accordion.hbs'))(
                defAccordionData.variants.measureSearchForm.props
              ),
          ],
        },
      },
    },
    statistic: {
      meta: {
        title: 'Statistik-Suche',
        desc: 'Suche für Bildungsstatistiken',
      },
      props: {
        dialogId: _.uniqueId('dialog-'),
        dialogTitle: 'Erweiterte Suche',
        closeButtonLabel: 'Schliessen',
        modules: {
          contentModules: [
            () =>
              handlebars.compile(dataHelper.getFileContent('../accordion/accordion.hbs'))(
                defAccordionData.variants.statisticSearchForm.props
              ),
          ],
        },
      },
    },
    statisticSingle: {
      meta: {
        title: 'Statistik-Suche Single',
        desc: 'Suche für Bildungsstatistiken mit nur einer Kategorie',
      },
      props: {
        dialogId: _.uniqueId('dialog-'),
        dialogTitle: 'Erweiterte Suche',
        closeButtonLabel: 'Schliessen',
        modules: {
          contentModules: [
            () =>
              handlebars.compile(dataHelper.getFileContent('../form/form.hbs'))({
                ...defaultFormData.variants.raumbezug.props,
                sectionTitle: 'Raumbezug',
                headingLevel: 3,
              }),
          ],
        },
      },
    },
    chatbot: {
      meta: {
        title: 'Chatbot Dialog',
        desc: 'Chatbot Dialog mit Neu Starten Aktion in Header',
      },
      props: {
        dialogId: _.uniqueId('dialog-'),
        dialogTitle: null,
        additionalClasses: 'mdl-dialog--chatbot',
        additionalActionButton: {
          icon: 'refresh',
          label: 'Neu starten',
        },
        closeButtonLabel: 'Schliessen',
        modules: {
          contentModules: ['<div class="mdl-chatbot__webchat"><div></div></div>'],
        },
        footerButtons: null,
      },
    },
  },
  (variant) => {
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
  }
);

data.variants = variants;

module.exports = data;
