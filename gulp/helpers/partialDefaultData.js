const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');

module.exports.register = function h(handlebars) {
  handlebars.registerHelper('partial_with_data', (partial, variant, options) => {
    const variantData = dataHelper.getDataGlob(`${process.cwd()}/src/${partial}.data.js`);
    const mergedData = _.merge({}, variantData[Object.keys(variantData)[0]].variants[variant].props, options.hash);
    const template = dataHelper.getFileContent(`${process.cwd()}/src/${partial}.hbs`);
    return handlebars.compile(template)(mergedData);
  });
}
