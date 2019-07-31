module.exports = (handlebarsTemplate, purgeConditionals = true) => {
  let output = handlebarsTemplate;
  if (purgeConditionals) {
    output = output.replace(/{{\#if (.*?)}}/gm, '');
  } else {
    output = output.replace(/{{\#if (.*?)}}/gm, '')
      .replace(/{{\/if}}/gm, '');
  }
  return output.replace(/{{{/gm, '${').replace(/}}}/gm, '}')
    .replace(/{{/gm, '${').replace(/}}/gm, '}');
};
