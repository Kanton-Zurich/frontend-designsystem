module.exports.register = function h(handlebars) {
  handlebars.registerHelper('getBefore', (array, index) => {
    if (index > 0 && index < array.length) {
      return array[index - 1];
    }
    return null;
  });
};
