//购物车小仓库
import { reqShopCart, } from '@/api'
//规范:利用vuex存储数据
let state = {
    //vuex仓库存储用户临时身份,vuex存储数据确实非持久化的，SET_USERID执行返回结果,可是本地存储获取的！！
    shopCartInfo:[]
};
let mutations = {
    GETSHOPCART(state, cartList) {
        state.shopCartInfo = cartList;
    }
};
let actions = {
    //获取用户购物车的数据
    async getShopCart({ commit, state, dispatch }) {
        let result = await reqShopCart();
        console.log(result);
        if (result.code == 200) {
            commit('GETSHOPCART', result.data);
        }
    },

};
let getters = {
    //计算数组里面第一个元素：对象
    CartInfo(state) {
        return state.shopCartInfo[0] || {};
    },
    
};

//对外暴露
export default {
    state,
    mutations,
    actions,
    getters
}