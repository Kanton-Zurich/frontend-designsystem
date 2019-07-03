module.exports.register = function h(handlebars) {
  handlebars.registerHelper('if_compare', function ifCompare(v1, operator, v2, options) {

    switch (operator) {
      case '!=':
        return (v1 !== v2) ? options.fn(this) : options.inverse(this);

      case '===':
        return (v1 === v2) ? options.fn(this) : options.inverse(this);

      case '!==':
        return (v1 !== v2) ? options.fn(this) : options.inverse(this);

      case '&&':
        return (v1 && v2) ? options.fn(this) : options.inverse(this);

      case '||':
        return (v1 || v2) ? options.fn(this) : options.inverse(this);

      case '<':
        return (v1 < v2) ? options.fn(this) : options.inverse(this);

      case '<=':
        return (v1 <= v2) ? options.fn(this) : options.inverse(this);

      case '>':
        return (v1 > v2) ? options.fn(this) : options.inverse(this);

      case '>=':
        return (v1 >= v2) ? options.fn(this) : options.inverse(this);

      default:
        return options.inverse(this);
    }
  });
};
