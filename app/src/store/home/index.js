import { reqCategoryList, reqBannerList, reqFloorList} from '@/api'

//state:仓库存储数据的地方
const state = {
    //state中的数据默认初始值别瞎写，服务器返回对象，服务器返回数组。【根据接口返回初始值的】
    categoryList: [],
    //首页轮播图的数据
    bannerList: [],
    //floor数据
    floorList: []
}
//mutations:修改state的唯一手段
const mutations = {
    CATEGORYLIST(state,categoryList) {
        state.categoryList = categoryList
        // console.log(state.categoryList);
    },
    GETBANNERLIST(state, bannerList) {
        state.bannerList = bannerList;
        // console.log('mutation修改数据')
    },
    GETFLOORLIST(state, floorList) {
        state.floorList = floorList;
    }
}
//action:处理action,可以书写自己的业务逻辑，也可以处理异步
const actions = {
    //通过API里面的接口函数调用，向服务器发送请求，获取服务器的数据
    async categoryList({commit}) {
        let result = await reqCategoryList()
        if (result.code == 200) {
            commit("CATEGORYLIST",result.data)
        }
    },
    //获取banner图的action
    async getBannerList({ commit, state, dispatch }) {
        //获取首页数据
        let result = await reqBannerList();
        if (result.code == 200) {
            // console.log('actions发请求')
            commit("GETBANNERLIST", result.data);
        }
    },
    //获取Floor组件的数据
    async getFloorList({ commit, state, dispatch }) {
        let result = await reqFloorList();
        if (result.code == 200) {
            commit('GETFLOORLIST', result.data);
            // console.log(result);
        }
    }
}
//getters: 理解为计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {}

//对外暴露store类的一个实例
export default {
    state,
    mutations,
    actions,
    getters
}
