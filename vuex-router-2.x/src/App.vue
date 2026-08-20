<template>
  <div id="app">
    <nav>
      <!-- <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> -->
    </nav>
    <div>辅助函数age:{{ age }}</div>
    <div>age:{{ $store.state.age }}</div>
    <div>num:{{ $store.state.num }}</div>
    <div>myAge:{{ $store.getters.myAge }}</div>
    <div>辅助函数myAge:{{ myAge }}</div>
    <button @click="$store.commit('changeAge', 8)">更新状态</button>
    <button @click="$store.dispatch('changeAge', 6)">异步更新状态</button>
    <button @click="$store.state.num += 10">严格模式增加10</button>
    <br />
    <!-- {{
      $store.state.a.c
    }} -->
    <router-view />
  </div>
</template>
<script>
/* eslint-disable*/
// import { mapState } from "vuex";
import { mapState,mapGetters } from './vuex';
export default {
  computed: {
    ...mapState(["age"]),// 等同于下面
    // age(){
    //   return this.$store.state.age
    // }
    ...mapGetters(['myAge'])
  },
  mounted() {},
};
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
