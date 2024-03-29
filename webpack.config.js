const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  devServer: {
    host: '0.0.0.0', 
    port: 3000,
    contentBase: './dist' 
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader','css-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'url-loader'
        ]
      },
      // {
      //   test: /\.js$/,
      //   exclude: [
      //     './src/unused/'
      //   ]
      // }
    ]
  },
};