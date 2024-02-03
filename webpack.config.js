const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
require('dotenv').config();

module.exports = {
  entry: './client/src/index.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false,
      },
    },
    runtimeChunk: false, // Add this line
  },
  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /.(css|scss)$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
      {
        test: /\.svg$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/public/views/index.html',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, './build'),
    },
    hot: true,
    port: 3000,
    proxy: {
      '/': 'http://localhost:' + process.env.PORT,
    },
  },
};
