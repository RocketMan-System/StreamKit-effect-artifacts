const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = env => [
  {
    mode: 'production',
    entry: './src/index.tsx',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: 'esbuild-loader',
        },
        {
          test: /\.less$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
        },
        {
          test: /\.(webp|webm|jpg|png|svg|ico|icns|mp3|gif)$/,
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          },
        },
      ],
    },
    target: 'web',
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
      }),
      new MiniCssExtractPlugin(),
      new webpack.DefinePlugin({
        'process.env.IS_LOCAL': env.target === "local",
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'manifest.json',
            to: 'manifest.json',
          },
        ],
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'logo.svg',
            to: 'logo.svg',
          },
        ],
      }),
    ],
  },
];
