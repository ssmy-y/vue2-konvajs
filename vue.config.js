const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      alias: {
        '@G': path.resolve(__dirname, 'src')
      }
    }
  }
})
