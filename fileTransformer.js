const fs = require('fs');

module.exports = {
  process(src, filename, config, options) {
    return (
      'module.exports = ' +
      JSON.stringify(fs.readFileSync(filename, 'utf8')) +
      ';'
    );
  },
};
