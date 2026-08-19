<template>
  <div id="app">
    <nav>
      <!-- <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> -->
    </nav>
    <!-- <div>age:{{ $store.state.age }}</div>
    <div>a:{{ $store.state.a }}</div>
    <div>myAge:{{ $store.getters.myAge }}</div>
    <button @click="$store.commit('changeAge', 8)">更新状态</button>
    <button @click="$store.dispatch('changeAge', 6)">异步更新状态</button>
    <button @click="$store.state.a += 10">增加10</button>
    <br /> -->
    <!-- {{
      $store.state.a.c
    }} -->
    <router-view />
  </div>
</template>

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
