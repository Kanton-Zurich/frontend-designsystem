const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('file_upload.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Datei-Upload',
    className: 'FileUpload',
    jira: 'CZHDEV-1280',
    documentation: dataHelper.getDocumentation('file_upload.md'),
  },
  props: {

  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Standard',
      desc: 'Standard Implementierung',
    },
    props: {
      title: 'Dokumente hochladen',
      subtitle: 'Hier können Sie ihren Lebenslauf hochladen',
      input: {
        name: 'file1',
        id: 'file1',
      },
      buttonLabel: 'Datei auswählen',
      dropzoneHint: 'Zum Hochladen Datei ziehen und hier ablegen',
    },
  },
  multiple: {
    meta: {
      title: 'Mehrere Dateien',
      desc: 'File Upload mit mehreren Dateien',
    },
    props: {
      title: 'Dokumente hochladen',
      subtitle: 'Hier können Sie ihre Dokumente hochladen',
      input: {
        name: 'file2',
        id: 'file2',
      },
      buttonLabel: 'Dateien auswählen',
      dropzoneHint: 'Zum Hochladen Dateien ziehen und hier ablegen',
      isMultiple: true,
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
