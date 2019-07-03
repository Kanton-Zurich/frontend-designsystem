module.exports.register = function h(handlebars) {
  handlebars.registerHelper('json', context => encodeURIComponent(JSON.stringify(context)));
};
