module.exports = {
  entry: './src/index.js',
  output: {
    path: './build/',
    publicPath: 'build/',
    filename: 'build.js'
  },
  module: {
    loaders: [
      { test: /\.vue$/, loader: 'vue' },
      { test: /\.js$/, loader: 'babel!eslint', exclude: /node_modules/ }
    ]
  },
  vue: {
    loaders: {
      js: 'babel!eslint'
    }
  }
}
