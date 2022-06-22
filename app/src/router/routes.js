//引入路由组件
// import Home from '@/pages/Home'
// import Search from '@/pages/Search'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Detail from '@/pages/Detail'
import AddCartSuccess from '@/pages/AddCartSuccess'
import ShopCart from '@/pages/ShopCart'
import Trade from '@/pages/Trade'
import Pay from '@/pages/Pay'
import PaySuccess from '@/pages/PaySuccess'
import Center from '@/pages/Center'
//引入二级路由组件
import MyOrder from '@/pages/Center/myOrder'
import GroupOrder from '@/pages/Center/groupOrder'

/*
当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。
如果我们能把不同路由对应的组件分割成不同的代码块，
然后当路由被访问的时候才加载对应组件，这样就会更加高效。
*/
// const foo = () => {
//     return import("@/pages/Home")
// }
//配置路由信息
export default [
    {
        path: "/home",
        component: () => import("@/pages/Home"),
        //路由元信息
        meta: { show: true }
    },
    {
        path: "/search/:keyword?",
        component: ()=>import("@/pages/Search"),
        meta: { show: true },
        name: 'search'
    },
    {
        path: "/login",
        component: Login,
        meta: { show: false }
    },
    {
        path: "/register",
        component: Register,
        meta: { show: false }
    },
    {
        path: "/detail/:skuId?",
        component: Detail,
        meta: { show: true }
    },
    {
        path: "/addcartsuccess",
        name: 'addcartsuccess',
        component: AddCartSuccess,
        meta: { show: true }
    },
    {
        path: '/shopcart',
        component: ShopCart,
        meta: { show: true }
    },
    {
        path: '/trade',
        component: Trade,
        meta: { show: true },
        beforeEnter: (to, from, next) => {
            if (from.path == "/shopcart") {
                next()
            } else {
                next(false)
            }
        }
    },
    {
        path: '/pay',
        component: Pay,
        meta: { show: true },
        beforeEnter: (to, from, next) => {
            if (from.path == "/trade") {
                next()
            } else {
                next(false)
            }
        }
    },
    {
        path: '/paysuccess',
        component: PaySuccess,
        meta: { show: true }
    },
    {
        path: '/center',
        component: Center,
        meta: { show: true },
        //二级路由组件
        children: [
            {
                path: 'myorder',
                component: MyOrder
            },
            {
                path: 'grouporder',
                component: GroupOrder
            },
            {
                path: '/center',
                redirect:'/center/myorder'
            }
        ]
    },
    //重定向，当项目跑起来的时,候\，访问/，立马让他定位到首页
    {
        path: '*',
        redirect: '/home'
    }
]