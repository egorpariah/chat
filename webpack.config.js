const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const globImporter = require('node-sass-glob-importer');

const config = {
  entry: './src/index.mjs',
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    proxy: {
      '/websocket': {
        target: 'ws://[::1]:8282',
        ws: true,
      },
      '/upload-photo': {
        target: 'http://localhost:8282',
      },
      '/src/img': {
        target: 'http://localhost:8282',
      },
    },
    hot: true,
  },

  module: {
    rules: [
      {
        test: /\.html$/i,
        use: 'html-loader',
        exclude: /index.html/,
      },
      {
        test: /\.hbs$/,
        use: 'handlebars-loader',
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: { sassOptions: { importer: globImporter() } },
          },
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(jpe?g|png|gif|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/img/[name][ext][query]',
        },
      },
      {
        test: /\.svg$/,
        type: 'asset',
        generator: {
          filename: 'assets/icons/[hash][ext][query]',
        },
        use: 'svgo-loader',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[hash][ext][query]',
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Чат',
      template: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.output.filename = '[name].js';
    config.devtool = 'source-map';
  }

  if (argv.mode === 'production') {
    config.output.filename = '[name].[chunkhash].js';
  }

  return config;
};
