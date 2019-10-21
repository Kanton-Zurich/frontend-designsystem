module.exports.register = function h(handlebars) {
  handlebars.registerHelper('module_path', context => `modules/${context}/${context}`);
};
