const _ = require('lodash');
const defaultData = require('../../data/default.data.js');
const skiplinksData = require('../../modules/skiplinks/skiplinks.data.js');
const richtextData = require('../../modules/richtext/richtext.data.js');
const dataHelper = require('@unic/estatico-data');

const data = _.merge({}, defaultData, {
  meta: {
    title: 'Einzelseite',
    jira: 'CZHDEV-283',
    content: dataHelper.getFileContent('single.hbs'),
    documentation: dataHelper.getDocumentation('single.md'),
  },
  props: {
    title: 'Einzelseite',
    text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
    modules: {
      // xy: require('../../modules/xy/xy.data.js').props
      skiplinks: skiplinksData.props,
      richtext: richtextData.props,
    },
  },
});

module.exports = data;
