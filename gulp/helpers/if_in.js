module.exports.register = function h(handlebars) {
  handlebars.registerHelper('if_in', function ifIn(value, list, options) {
    if (Array.isArray(list)) {
      const isInList = list.includes(value);
      return isInList ? options.fn(this) : options.inverse(this);
    } else if (typeof list === 'string') {
      const isInString = list.split(',').includes(value);
      return isInString ? options.fn(this) : options.inverse(this);
    }
    return options.inverse(this);
  });
};
