<template>
  <nav>
    <div>pinia模块：{{ counterStore.count }}</div>
    <div>pinia计算属性:{{ counterStore.doubleCount }}</div>
    <button @click="handlerClick">基础修改</button>

    <button @click="counterStore.increment">异步修改</button>
    <!-- <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> -->
  </nav>
  <router-view />
</template>
<script>
import { computed } from "vue";
import { useCounterStore } from "./store/counter";
export default {
  name: "App",
  setup(props) {
    const counterStore = useCounterStore();
    console.log(counterStore);
    const handlerClick = ()=>{
      counterStore.count++
    }

    return {
      counterStore,
      handlerClick
    };
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
