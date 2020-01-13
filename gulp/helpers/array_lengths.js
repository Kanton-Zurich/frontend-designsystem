module.exports.register = function h(handlebars) {
  handlebars.registerHelper('ifLengthBetween', (array, min, max, options) => {
    if (array.length >= min && array.length <= max) {
      return options.fn(this);
    }

    return options.inverse(this);
  });

  handlebars.registerHelper('ifLongerThan', (array, min, options) => {
    if (array.length > min) {
      return options.fn(this);
    }

    return options.inverse(this);
  });

  handlebars.registerHelper('log', (something) => {
    console.log(something);
  });
};
