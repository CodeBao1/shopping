//vue的插件一定是暴露了一个对象
let myPlugins = {}

myPlugins.install = function (Vue,options) {
    // console.log('调用');
    // Vue.prototype.$bus  //任何组件都可以使用
    // Vue.directive   //自定义指令
    Vue.directive(options.name, (element,params) => {
        element.innerHTML = params.value.toUpperCase()
    })
}


export default myPlugins