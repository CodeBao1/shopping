//通过js插件模拟数据
// 引入mock模块
import Mock from 'mockjs'
//把json数据格式引入进来
import banner from './banner.json'
import floor from './floor.json'

//webpack默认对外暴露：图片，JSON数据格式
//mock数据：第一个参数，请求地址，第二个参数：请求数据
Mock.mock("/mock/banner", { code: 200, data: banner })
Mock.mock("/mock/floor", { code: 200, data: floor })