const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'redux-jarm.js',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: [
              '@babel/env',
              '@babel/react',
            ],
            plugins: [
              '@babel/proposal-class-properties',
              ['@babel/proposal-decorators', {
                decoratorsBeforeExport: true,
              }],
              '@babel/proposal-do-expressions',
              '@babel/proposal-export-default-from',
              '@babel/proposal-export-namespace-from',
              '@babel/proposal-function-bind',
              '@babel/proposal-function-sent',
              '@babel/proposal-json-strings',
              '@babel/proposal-logical-assignment-operators',
              '@babel/proposal-nullish-coalescing-operator',
              '@babel/proposal-numeric-separator',
              '@babel/proposal-optional-chaining',
              '@babel/proposal-throw-expressions',
              '@babel/syntax-dynamic-import',
              '@babel/syntax-import-meta',
            ],
          },
        },
      },
    ],
  },
};
