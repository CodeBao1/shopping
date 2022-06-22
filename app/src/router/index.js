//引入
import Vue from 'vue'
import VueRouter from 'vue-router'
//使用插件
Vue.use(VueRouter)
import routes from './routes'
//引入store
import store from '@/store'

//先把VueRouter原型对象的push，先保存一份
let originPush = VueRouter.prototype.push
let originReplace = VueRouter.prototype.replace
//重写push|replace
VueRouter.prototype.puch = function (location, resolve, reject) {
    if (resolve && reject) {
        originPush.call(this,location, resolve, reject);
    } else {
        originPush.call(this,location, ()=>{},()=>{} );
    }
}
VueRouter.prototype.replace = function (location, resolve, reject) {
    if (resolve && reject) {
        originReplace.call(this, location, resolve, reject);
    } else {
        originReplace.call(this, location, () => { }, () => { });
    }
}
//配置路由-
let router = new VueRouter({
    routes,
    scrollBehavior(to, from, savedPosition) {
        // return 期望滚动到哪个的位置 代表滚动条在最上方
        return{y:0}
    },
})
//全局守卫，前置守卫（在路由跳转之间进行判断）
router.beforeEach(async(to,from,next) => {
    //to 可以获取到你要跳转到的那个路由信息
    //from 可以获取到你从那个路由而来的信息
    //next  放行的函数 next()  next(path)放行到指定的路由  next（false）
    // next()
    let token = store.state.user.token
    // 用户信息
    let name = store.state.user.useInfo.loginName
    // console.log(name);
    //用户已经登录了，才会有token
    if (token) {
        //用户登录的不能去login
        if (to.path == '/login') {
            console.log('1111');
            next('/home')

        } else {
            //登陆了，但是去的不是login,可能是search
            if (name) {
                next()
                console.log('2222');
            } else {
                try {
                    //没有用户信息，派发actions,让仓库存储用户信息在跳转
                    await store.dispatch("getUserInfo")
                    next()
                    console.log('3333');
                } catch(error) {
                    //token失效了
                    await store.dispatch('userLogin')
                    next('/login')
                }
               
            }

        }
    } else {
       //未登录，不能去交易相关，不能去支付相关，不能去个人中心
        //未登录去以上----跳转到登录
        let toPath = to.path
        if (toPath.indexOf('/trade') != -1 || toPath.indexOf('/pay') !== -1 || toPath.indexOf('/center') !== -1 ) {
            next('/login')
        } else {
            next()
        }
    }
})

export default router