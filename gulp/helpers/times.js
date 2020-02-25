module.exports.register = function h(handlebars) {
  handlebars.registerHelper('times', function (n, block) {
    let accum = '';
    for (let i = 0; i < n; i += 1) {
      const blockContext = Object.assign(i, this);
      accum += block.fn(blockContext);
    }
    return accum;
  });
};
