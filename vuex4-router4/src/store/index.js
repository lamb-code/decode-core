import { createStore } from "@/vuex";
function persists(store) {
  let local = localStorage.getItem("vuex");
  if (local) {
    store.replaceState(JSON.parse(local));
  }
  store.subscribe((mutation, state) => {
    localStorage.setItem("vuex", JSON.stringify(state));
  });
}
const strore = createStore({
  strict: true,
  plugins: [],
  state: {
    //组件的data
    count: 0,
  },
  getters: {
    // 计算属性 vuex4 他并没有实现计算属性的功能
    double(state) {
      return state.count * 2;
    },
  },
  mutations: {
    //可以更改状态 必须是同步更改的
    add(state, payload) {
      state.count += payload;
    },
  },
  actions: {
    // 可以调用其他action 或者调用mutation
    asyncAdd({ commit }, payload) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit("add", payload);
          resolve();
        }, 1000);
      });
    },
  },
  modules: {
    aCount: {
      namespaced: true,
      state: { count: 0 },
      mutations: {
        //可以更改状态 必须是同步更改的
        add(state, payload) {
          state.count += payload;
        },
      },
      modules: {
        cCount: {
          state: {
            count: 0,
          },
          mutations: {
            //可以更改状态 必须是同步更改的
            add(state, payload) {
              state.count += payload;
            },
          },
        },
      },
    },
    bCount: {
      state: { count: 0 },
      mutations: {
        //可以更改状态 必须是同步更改的
        add(state, payload) {
          state.count += payload;
        },
      },
    },
  },
});

strore.registerModule(["aCount", "ecount"], {
  namespaced: true,
  state: { count: 0 },
  mutations: {
    //可以更改状态 必须是同步更改的
    add(state, payload) {
      state.count += payload;
    },
  },
});
export default strore;
