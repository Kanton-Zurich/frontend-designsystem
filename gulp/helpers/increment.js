module.exports.register = function h(handlebars) {
  handlebars.registerHelper('increment', number => (
    parseInt(number, 10) + 1
  ));
};
