const devConfig = require('./webpack.dev.js');

module.exports = {
  ...devConfig,
  mode: 'production',
};
