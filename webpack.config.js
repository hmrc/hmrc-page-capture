const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: {
    background: path.resolve('src/background.ts'),
    content: path.resolve('src/content.ts'),
    popup: path.resolve('src/popup.ts'),
  },
  module: {
    rules: [
      {
        use: 'ts-loader',
        test: /\.tsx?$/i,
        exclude: /node_modules/,
      },
      {
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        test: /\.(sa|sc|c)ss$/i,
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve('src/manifest.json'),
          to: path.resolve('dist'),
        },
        {
          from: path.resolve('src/assets/images/icon.png'),
          to: path.resolve('dist'),
        },
      ],
    }),
    new HtmlWebpackPlugin({
      title: 'HMRC Page Capture',
      filename: 'popup.html',
      template: path.resolve('src/template.html'),
      chunks: ['popup'],
    }),
    new MiniCssExtractPlugin(),
  ],
  output: {
    filename: '[name].js',
    path: path.resolve('dist'),
    clean: true,
  },
};
