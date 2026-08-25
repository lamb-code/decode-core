<template>
  <nav>
    <div>pinia模块：{{ counterStore.count }}</div>
    <div>pinia计算属性:{{ counterStore.doubleCount }}</div>
    <button @click="handlerClick">基础修改</button>

    <button @click="counterStore.increment">异步修改</button>
    <button @click="counterStore.$reset">重置state</button>

    <ul>
      <li v-for="(item, index) in counterStore.fruits" :key="index">
        {{ item }}
      </li>
    </ul>
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
    let list = [...counterStore.fruits, "test"];
    // const handlerClick = ()=>{
    //  counterStore.$patch({
    //   count:counterStore.count++,
    //   fruits:list
    //  })
    const handlerClick = () => {
      counterStore.$patch(() => {
        counterStore.count++;
        counterStore.fruits.push("0000");
      });
      // counterStore.increment()
    };
    counterStore.$subscribe((mutation,state)=>{

    })
    counterStore.$onAction((after, onError, name) => {
      console.log('action 执行了')
      after((result)=>{
        console.log('数据更新完成！',result)
      })
      onError(()=>{
        console.log('出错了')
      })
    });
    return {
      counterStore,
      handlerClick,
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
