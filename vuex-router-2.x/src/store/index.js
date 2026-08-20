/* eslint-disable*/
import Vue from "vue";
import Vuex from "../vuex/index";
// import Vuex from "vuex";
//插件开发 一般都是函数 vuex 插件开发涉及到replaceState subscribe两个api  plugins属性
function persists(store) {
  const key = "vuex:state";
  const local = localStorage.getItem(key);
  console.log("插件执行");
  if (local) {
    store.replaceState(JSON.parse(local));
  }
  store.subscribe((mutation, state) => {
    console.log("subscribe执行");
    localStorage.setItem(key, JSON.stringify(state));
  });
}
Vue.use(Vuex);
//内部会创建一个vue实例，通信用的
const store = new Vuex.Store({
  strict: true, //严格模式，严格模式下只能通过mutation来更改状态其他都不可以
  plugins: [persists],
  state: {
    //组件的状态 等价于 new Vue(data)
    num: 20,
    age: 18,
  },
  getters: {
    //获取计算属性 等价于 new Vue(computed) 当依赖的值变化会重新执行

    myAge(state) {
      //如果返回的值相同 不会重新执行这个函数
      return state.age + 5;
    },
  },
  mutations: {
    //vue中的方法 唯一可以改状态的方法，同步的方法
    changeAge(sate, payload) {
      //严格模式 mutation 里写异步逻辑会报错
      // setTimeout(()=>{
      //   sate.age += payload;
      // },1000)
      sate.age += payload;
    },
  },
  actions: {
    //通过action发起请求
    changeAge({ commit }, payload) {
      setTimeout(() => {
        commit("changeAge", payload);
      }, 1000);
    },
  },
  modules: {
    // a: {
    //   state: {
    //     c: 100,
    //   },
    //   mutations: {
    //     changeAge(sate, payload) {
    //       console.log("c更新");
    //     },
    //   },
    // },
    b: {
      state: {
        d: 102,
      },
      mutations: {
        changeAge(sate, payload) {
          console.log("d更新");
        },
      },
      modules: {
        c: {
          state: {
            e: 300,
          },
        },
      },
    },
  },
});
export default store;

//关于模块注意的问题
// 默认模块没有作用域问题
// 状态不要和模块的名字相同
// 默认计算属性是直接通过getters取值
// 如果增加namespaced 会将这个模块的属性都封装到这个作用域下
//默认会找当前模块上是否有namespace 并且将父级的namespace 一同算上做成命名空间
