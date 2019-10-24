module.exports = (handlebarsTemplate, purgeConditionals = true) => {
  let output = handlebarsTemplate;
  if (purgeConditionals) {
    output = output.replace(/{{#unless (.*?)\/unless}}/gms, '');
    output = output.replace(/{{#if (.*?)\/if}}/gms, '');
  } else {
    output = output.replace(/{{#if (.*?)}}/gms, (m) => {
      const attr = m.replace(' ', '').replace(/{{#if/gms, '').replace('}}', '');
      return `<% if (typeof(${attr}) !== "undefined" && ${attr} !== false) { %>`;
    }).replace(/{{\/if}}/gms, '<% } %>');
  }
  return output.replace(/{{{/gms, '<%=').replace(/}}}/gms, '%>')
    .replace(/{{/gms, '<%=').replace(/}}/gms, '%>');
};
