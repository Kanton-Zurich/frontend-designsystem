const _ = require('lodash');
const dataHelper = require('@unic/estatico-data');
const defaultData = require('../../data/default.data.js');
const { handlebars } = require('@unic/estatico-handlebars');

const template = dataHelper.getFileContent('../layouts/layoutmarkup.hbs');

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Scaffolding',
  },
  code: {
    handlebars: dataHelper.getFormattedHandlebars(template),
    html: dataHelper.getFormattedHtml(handlebars.compile(template)(_.merge({
      meta: {
        aemPath: '/etc.clientlibs/sanagate/core/clientlibs/publish/resources',
      },
    }, defaultData))),
    html_prod: dataHelper.getFormattedHtml(handlebars.compile(template)(_.merge({
      meta: {
        aemPath: '/etc.clientlibs/sanagate/core/clientlibs/publish/resources',
      },
    }, defaultData, { env: { dev: false } }))),
  },
});

module.exports = data;
