const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const { handlebars } = require('@unic/estatico-handlebars');
const defaultData = require('../../data/default.data.js');

const anchorlink1 = {
  anchorlinkText: 'Amt für Raumentwicklung',
  anchorlinkAdress: '#',
  anchorlinkIsActive: false,
  anchorlinkIsTagAnchor: true,
  anchorlinkIsInverted: true,
  anchorlinkIsTopitem: true,
  anchorlinkIsTopitemSmall: true,
};
const anchorlink2 = {
  anchorlinkText: 'Strassenverkehrsamt',
  anchorlinkAdress: '#',
  anchorlinkIsActive: false,
  anchorlinkIsTagAnchor: true,
  anchorlinkIsInverted: true,
  anchorlinkIsTopitem: true,
  anchorlinkIsTopitemSmall: true,
};
const anchorlink3 = {
  anchorlinkText: 'Kantonspolizei',
  anchorlinkAdress: '#',
  anchorlinkIsActive: false,
  anchorlinkIsTagAnchor: true,
  anchorlinkIsInverted: true,
  anchorlinkIsTopitem: true,
  anchorlinkIsTopitemSmall: true,
};
const anchorlink4 = {
  anchorlinkText: 'Koordinationsstelle Velo',
  anchorlinkAdress: '#',
  anchorlinkIsActive: false,
  anchorlinkIsTagAnchor: true,
  anchorlinkIsInverted: true,
  anchorlinkIsTopitem: true,
  anchorlinkIsTopitemSmall: true,
};
const template = dataHelper.getFileContent('tag_group.hbs');
const data = _.merge({}, defaultData, {
  meta: {
    title: 'Tag Group',
    className: 'TagGroup',
    jira: 'CZHDEV-261',
    documentation: dataHelper.getDocumentation('tag_group.md'),
  },
  props: {
    tagGroupdHeading: {
      title: 'Für dieses Thema zuständig:',
    },
    anchorLinks: [
      {
        anchorlink: anchorlink1,
      },
      {
        anchorlink: anchorlink2,
      },
      {
        anchorlink: anchorlink3,
      },
      {
        anchorlink: anchorlink4,
      },
    ],
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
