module.exports.register = function h(handlebars) {
  handlebars.registerHelper('if_even', function ifEven(conditional, options) {
    const evenDivider = 2;

    if ((conditional % evenDivider) === 0) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
};
