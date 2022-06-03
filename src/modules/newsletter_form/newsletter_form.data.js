const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');
const radioData = require('../../atoms/radiobutton/radiobutton.data');
const formData = require('../../modules/form/form.data');
const defFormInputData = require('../../atoms/form_input/form_input.data').variants.defaultForForms.props;
const defFormInputEmailData = require('../../atoms/form_input/form_input.data').variants.floatValidateEmail.props;
const defButtonData = require('../../atoms/button/button.data').variants.default.props;

const template = dataHelper.getFileContent('newsletter_form.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Newsletter Formular',
    className: 'NewsletterForm',
    jira: 'CZHDEV-1713',
    label: 'Formular',
    documentation: dataHelper.getDocumentation('README.md'),
  },
  props: {
    action: '/go_to_newsletter',
    method: 'GET',
    formInputData: _.merge({}, defFormInputEmailData, {
      isSmall: true,
      isFloatingLabel: false,
      label: 'Ihre E-Mail',
      id: 'email-d',
      name: 'email-d',
    }),
    buttonData: _.merge({}, defButtonData, {
      text: 'Themen wählen',
    }),
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Default',
      desc: 'Default implementation',
    },
    props: {
      wrapped: true,
      reduced: true,
      headingLevel: 2,
      title: 'Unser Newsletter',
      description: 'Abonnieren Sie unseren Newsletter und erhalten Sie die News, die für Sie relevant sind.',
    },
  },
  regular: {
    meta: {
      title: 'Komplex',
      desc: '',
    },
    props: {
      wrapped: false,
      headingLevel: 2,
      title: 'Unser Newsletter',
      description: 'Abonnieren Sie unseren Newsletter und erhalten Sie die News, die für Sie relevant sind.',
      newsletterFormData: formData.variants.newsletter.props,
      radioButtons: [
        _.merge({},
          radioData.variants.default.props,
          {
            label: 'Frau',
            groupName: 'salutation',
            id: 1,
            value: 'mrs',
            validation: {
              isRequired: true,
            },
          }),
        _.merge({},
          radioData.variants.default.props,
          {
            label: 'Herr',
            groupName: 'salutation',
            id: 2,
            value: 'mr',
            validation: {
              isRequired: true,
            },
          }),
        _.merge({},
          radioData.variants.default.props,
          {
            label: 'Keine Angabe',
            groupName: 'salutation',
            id: 3,
            value: 'no',
            validation: {
              isRequired: true,
            },
          }),
      ],
      formInputFirstname: _.merge({}, defFormInputData, {
        isSmall: false,
        isFloatingLabel: false,
        label: 'Vorname',
        id: 'firstname',
        name: 'firstname',
        validation: {
          isRequired: true,
        },
      }),
      formInputLastname: _.merge({}, defFormInputData, {
        isSmall: false,
        isFloatingLabel: false,
        label: 'Nachname',
        id: 'lastname',
        name: 'lastname',
        validation: {
          isRequired: true,
        },
      }),
      formInputEmail: _.merge({}, defFormInputEmailData, {
        isSmall: false,
        isFloatingLabel: false,
        label: 'Ihre E-Mail',
        id: 'email',
        name: 'email',
        validation: {
          isRequired: true,
        },
      }),
      buttonData: _.merge({}, defButtonData, {
        text: 'Newsletter abonnieren',
      }),
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
