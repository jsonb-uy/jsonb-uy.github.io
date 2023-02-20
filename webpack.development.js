const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const chokidar = require('chokidar');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: './dist',
      watch: {
        ignored: [/node_modules/],
      },
    },
    hot: true,
    liveReload: false,
    onBeforeSetupMiddleware: (devServer) => {
      // Live reload on HTML change.
      chokidar.watch([
        './src/**/*.html'
      ]).on('all', function() {
        devServer.sendMessage(devServer.webSocketServer.clients, 'content-changed');
      })
    }
  }
});
