import { effectScope, markRaw, ref } from "vue";
import { SymbolPinia } from "./rootState";

export function createPinia(){
    const scope = effectScope(true)
    const state= scope.run(()=>ref({}))//run方法的返回值就是这个fn的返回结果
    const pinia =markRaw({
        install(app){
            //希望pinia共享出去
            //将pinia实例暴露到app根组件上,所有子组件都可以通过inject注入进来
            app.provide(SymbolPinia,pinia)
            app.config.globalProperties.$pinia=pinia
            app._a=app
        },
        state,//所有的状态
        _e:scope,//用来管理这个应用的整个effecScope
        _s:new Map() //记录所有的store
    })
    return pinia
}