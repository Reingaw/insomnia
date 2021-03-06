const webpack = require('webpack');
const path = require('path');
const pkg = require('../package.json');

module.exports = {
  devtool: 'source-map',
  context: path.join(__dirname, '../app'),
  entry: ['./renderer.js', './renderer.html'],
  output: {
    path: path.join(__dirname, '../build'),
    filename: 'bundle.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: ['babel-loader'],
        exclude: [/node_modules/, /__fixtures__/, /__tests__/],
      },
      {
        test: /\.(less|css)$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'less-loader', options: { noIeCompat: true } },
        ],
      },
      {
        test: /\.(html|woff2)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
      {
        test: /\.(png)$/,
        loader: 'url-loader',
      },
    ],
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
    extensions: ['.js', '.json'],
    mainFields: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main'],
  },
  node: {
    __dirname: false, // Use Node __dirname
  },
  externals: [
    // Omit all dependencies in app/package.json (we want them loaded at runtime via NodeJS)
    ...Object.keys(pkg.dependencies).filter(name => !pkg.packedDependencies.includes(name)),

    // To get jsonlint working...
    'file',
    'system',
  ],
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.ContextReplacementPlugin(/\/@giphy\/js-brand\//, data => {
      delete data.dependencies[0].critical;
      return data;
    }),
  ],
  target: 'electron-renderer',
};
