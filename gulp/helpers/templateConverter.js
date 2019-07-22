module.exports = handlebarsTemplate => (
  handlebarsTemplate
    .replace(/{{#if.*\/if}}/gm, '')
    .replace(/{{/gm, '${')
    .replace(/}}/gm, '}')
);
