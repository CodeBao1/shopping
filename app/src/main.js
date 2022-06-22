import Vue from 'vue'
import App from './App.vue'
//三级联动的组件---全局组件
import TypeNav from '@/components/TypeNav'
import Carsousel from '@/components/Carousel'
import Pagination from '@/components/Pagination'
import { Button, MessageBox } from 'element-ui'
//第一个参数：全局组件的名字,第二个参数哪一个组件。
Vue.component(TypeNav.name, TypeNav)
Vue.component(Carsousel.name, Carsousel)
Vue.component(Pagination.name, Pagination)
//注册全局组件,两种方法，挂在原型上
Vue.component(Button.name, Button)
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
//引入路由
import router from '@/router'
//引入仓库
import store from '@/store'
//测试
// import { reqCategoryList } from '@/api'
// reqCategoryList()
//引入mockServe.js
import '@/mock/mockServe'
//统一接口也api文件夹里面全部请求函数
//统一引入
//将项目全部请求函数引入进来[分别暴露]
import * as http from '@/api';
//引入插件
import VueLazyload from 'vue-lazyload'
import yj from '@/assets/yj.jpeg'
//注册插件
Vue.use(VueLazyload, {
  //懒加载默认图片
  loading: yj,
})
Vue.config.productionTip = false
//引入自定义事件
import myPlugins from '@/plugins/myPlugins'
Vue.use(myPlugins, {
  name:'upper',
})

//引入表单校验插件
import "@/plugins/validate"

new Vue({
  render: h => h(App),
  //全局事件总线$bus
  beforeCreate() {
    Vue.prototype.$bus = this
    Vue.prototype.$http = http;
  },
  //注册路由:底下的写法KV一致省略V【router小写的】
  // 注册路由信息：当书写上router的时候，组件身上都拥有$route,$router属性
  router,
  //注册仓库 :书写上store的时候，组件身上都拥有$store属性
  store,
}).$mount('#app')
