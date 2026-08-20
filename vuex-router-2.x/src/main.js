/* eslint-disable */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
Vue.config.productionTip = false
// console.log(Vue.options)
const vm = new Vue({
  router, //router为什么不能放在原型上？防止其他重新new Vue也会拿到router,这里只是让所有子组件都可以获取router属性
  store,
  render: h => h(App)
}).$mount('#app')
console.log(vm)
// 手写路由分析：
// 前端路由有常见的两个方案hash的模式 #aaa #bbb；浏览器的历史记录是一个栈结构
