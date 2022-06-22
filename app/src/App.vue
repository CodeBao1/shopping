<template>
  <div id="app">
    <!-- 测试 -->
  <!-- <h1 v-upper="msg"></h1> -->
   <Header></Header>
   <!-- 路由组件出口 -->
   <router-view></router-view>
   <!-- 在Home、Search显示，在登录注册隐藏 -->
   <!-- <Footer v-show="$route.path=='/home'||$route.path=='/search'"></Footer> -->
   <Footer v-show="$route.meta.show"></Footer>
  </div>
</template>

<script>
//引入
import Header from './components/Header'
import Footer from './components/Footer'
export default{
  name:'App',
  data(){
    return{
      msg:"abc"
    }
  },
  components:{
    Header,
    Footer
  },
  mounted() {
    //通知Vuex发送请求，获取数据，存储于仓库
    this.$store.dispatch('categoryList')
  },
}
</script>

<style scoped>
</style>
