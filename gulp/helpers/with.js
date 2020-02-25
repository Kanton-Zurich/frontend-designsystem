module.exports.register = function h(handlebars) {
  handlebars.registerHelper('with', function (context, options) {
      const expContext = Object.assign({}, this, context);
      return options.fn(expContext);
    });
};
