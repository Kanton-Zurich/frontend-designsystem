const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const template = dataHelper.getFileContent('organisation_teaser.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'OrganisationTeaser',
    className: 'OrganisationTeaser',
    jira: 'CZHDEV-497',
    documentation: dataHelper.getDocumentation('organisation_teaser.md'),
  },
  props: {
    orgTitle: 'Kantonsrat',
    orgLead: 'Der Kantonsrat ist die Legislative. Er beschliesst Gesetze und überwacht die Tätigkeiten des Regierungsrats.',
    url: '#',
  },
});
const variants = _.mapValues({
  default: {
    meta: {
      title: 'Kantonsrat',
      desc: '',
    },
  },
  courts: {
    meta: {
      title: 'Gerichte',
      desc: '',
    },
    props: {
      orgTitle: 'Gerichte',
      orgLead: 'Die Gerichte des Kantons Zürich sprechen Recht anhand der Gesetze auf kantonaler und nationaler Ebene. Das höchste Gericht des Kantons Zürich ist das Obergericht.',
      url: '#',
    },
  },
  municipialities: {
    meta: {
      title: 'Gemeinden',
      desc: '',
    },
    props: {
      orgTitle: 'Gemeinden',
      orgLead: 'Die Gemeinden sind die kleinste politische Behörde in der Schweiz. Im Sinne des Föderalismus kommt ihnen eine wichtige Rolle zugute.',
      url: '#',
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
