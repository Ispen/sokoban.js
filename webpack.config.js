const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const  HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');

module.exports = {
   mode: 'development',
  entry: {
    app: './src/client/javascript/game.js',
    phaser: './node_modules/phaser/dist/phaser.js'
  },
  devtool: 'inline-source-map',
  plugins: [
    // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
        title: 'Sokoban.js',
        index: 'views/index.pug',
        error: 'views/error.pug',
    }),
    new HtmlWebpackPugPlugin({
        adjustIndent: true
    })
    ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
       {
       test: /\.(png|svg|jpg|gif)$/,
         use: [
          'file-loader',
       ],
      },
    ]
  }
};