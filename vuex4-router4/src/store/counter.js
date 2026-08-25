import { defineStore } from "@/pinia";

export const useCounterStore = defineStore("counter", {
  state: () => ({
    count: 2,
  }),
  getters:{
    doubleCount:(store)=>store.count*2
  },
  actions:{
    //同步异步修改数据都在action里
    increment(){
        this.count++ //this指示的就是当前的store
    }
  }
});
//第二种用法
// export  const useNumStore=defineStore(()=>{

// })
