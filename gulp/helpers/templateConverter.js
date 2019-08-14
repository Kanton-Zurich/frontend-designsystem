module.exports = (handlebarsTemplate, purgeConditionals = true) => {
  let output = handlebarsTemplate;
  if (purgeConditionals) {
    output = output.replace(/{{#if (.*?)}}/gm, '');
    output = output.replace(/{{\/if}}/gm, '');
  } else {
    output = output.replace(/{{#if (.*?)}}/gm, (m) => {
      const attr = m.replace(' ', '').replace(/{{#if/gm, '').replace('}}', '');
      return `<% if (typeof(${attr}) !== "undefined" && ${attr} !== false) { %>`;
    }).replace(/{{\/if}}/gm, '<% } %>');
  }
  return output.replace(/{{{/gm, '<%=').replace(/}}}/gm, '%>')
    .replace(/{{/gm, '<%=').replace(/}}/gm, '%>');
};
