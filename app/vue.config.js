const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  productionSourceMap: false,
  transpileDependencies: true,
  //关闭eslint校验
  lintOnSave: false,
  //代理跨域
  devServer: {
    proxy: {
      '/api': {
        // target: 'http://39.98.123.211',
        target: 'http://gmall-h5-api.atguigu.cn'
        // pathRewrite: { '^/api': '' },
      },
    },
  },
})
