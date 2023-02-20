const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const tailwindcss = require('tailwindcss');

module.exports = {
  entry: {
    index: './src/js/index.js'
  },
  output: {
    filename: 'js/[name]-[contenthash].js',
    path: path.resolve(__dirname, '../dist'),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, '../src/css'),
        use: [
          MiniCssExtractPlugin.loader, 
          { 
            loader: 'css-loader', 
            options: {
              sourceMap: false,
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  tailwindcss(path.resolve(__dirname, 'tailwind.config.js'))   ,
                  'autoprefixer'   
                ]
              }
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        include: path.resolve(__dirname, '../src/images'),
        type: 'asset/resource',
        generator : {
          filename : 'images/[name]-[contenthash][ext]',
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        include: path.resolve(__dirname, '../src/fonts'),
        type: 'asset/resource',
        generator : {
          filename : 'fonts/[name]-[contenthash][ext]',
        }
      },
      {
        test: /\.html$/i,
        include: path.resolve(__dirname, '../src'),
        use: 'html-loader' // resolve image references/dependencies in HTML
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body'
    }),
    new MiniCssExtractPlugin({
      filename: "css/app-[contenthash].css",
    })
  ],
  optimization: {
    runtimeChunk: 'single',
    moduleIds: 'deterministic',
    splitChunks: {
      cacheGroups: {
       vendor: {
         test: /[\\/]node_modules[\\/]/,
         name: 'vendors',
         chunks: 'all',
       },
      },
    },
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        format: {
          comments: false
        }
      },
      extractComments: false
    })]
  }
};