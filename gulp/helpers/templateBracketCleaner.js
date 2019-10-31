module.exports = rawHTML => (
  rawHTML.replace(/&lt;/gm, '<').replace(/&gt;/gm, '>')
);
