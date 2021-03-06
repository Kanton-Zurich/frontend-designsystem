const _ = require('lodash');
const defaultData = require('../../data/default.data.js');

const data = _.merge({}, defaultData, {
  meta: {
    title: 'GridTest',
  },
  props: {
    title: 'Title',
    title_fullwidth: 'Beispiel für ein Gridsystem mit voller Breite',
    text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
    modules: {
      // xy: require('../../modules/xy/xy.data.js').props
    },
  },
});

module.exports = data;
