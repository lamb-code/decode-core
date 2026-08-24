<template>
  <nav>
   
    <div>计数器: {{ $store.state.count }}{{ count }} <button @click="$store.state.count++">错误修改</button></div>

    <div>计算属性:{{ double }}</div>
    <!-- 错误写法  严格模式下就会报错 -->
    
    <button @click="add">同步修改</button>
    <button @click="asyncAdd">异步修改</button>

    <!-- <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> -->
    
  </nav>
  <router-view />
</template>
<script>
import {computed} from 'vue'
import { useStore } from "@/vuex";
export default {
  name: "App",
  setup(props) {
    const store = useStore();
    function add(){
      store.commit('add',1)
    }
    function asyncAdd(){
      store.dispatch('asyncAdd',1)
    }
    return {
      count:computed(()=>store.state.count),
      double:computed(()=>store.getters.double),
      add,
      asyncAdd
    }
  },
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
