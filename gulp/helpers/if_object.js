module.exports.register = function h(handlebars) {
  handlebars.registerHelper('if_object', (element, options) => {
    const type = typeof element;

    if ((type === 'function' || type === 'object') && !!element) {
      return options.fn(this);
    }

    return options.inverse(this);
  });
};
