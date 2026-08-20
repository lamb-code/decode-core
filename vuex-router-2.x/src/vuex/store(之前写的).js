/* eslint-disable*/
import appllyMixin from "./mixin";
import ModuleCollection from "./module/module-collection";
import { forEachValue } from "./util";
let Vue;
//  最终用户拿到是这个实例

function installModule(store, rootState, path, module) {
    //如果是子模块 我就需要将子模块的状态定义到根模块上
    if (path.length > 0) {
        let parent = path.slice(0, -1).reduce((memo, current) => {
            return memo[current]
        }, rootState)
        Vue.set(parent, path[path.length - 1], module.state)
    }
    module.forEachMutation((mutation, type) => {
        store._mutations[type] = (store._mutations[type] || [])
        store._mutations[type].push((payload) => {
            mutation.call(store, module, state, payload)
        })
    })
    module.forEachAction((action, type) => {
        store._actions[type] = (store._actions[type] || [])
        store._actions[type].push((payload) => {
            action.call(store, store, payload)
        })
    })
    module.forEachGetter((getter, key) => {
        store._wrapperGetters[key] = function (params) {
            return getter(module.state)
        }
    })
    module.forEachChild((child, key) => {
        installModule(store, rootState, path.concat(key), child)
    })
}
function resetStoreVm(store, state) {
    const wrapperGetters = state._wrapperGetters
    const computed={}
    store.getters={}
    forEachValue(wrapperGetters,(fn,key)=>{
        computed[key]=function(){
            return fn(store.state)
        }
        Object.defineProperty(store.getters,key,{
            get:store._vm[key]
        })
    })
    store._vm = new Vue({
        data: {
            $$state: state //vue中定义数据，属性名是有特点的  如果属性名是$xxx命名的 他不会被代理vue的实例上 所以用了两个$$
        },
    })
}

class Store {
    constructor(options) {
        console.log('install vuex', options)
        //格式化用户传入的参数 格式化成树形结构，更直观些 后续也 更好操作些
        this._modules = new ModuleCollection(options)
        let state = this._modules.root.state
        this._mutations = {}
        this._actions = {}
        this._wrapperGetters = {}
        console.log(this._modules)
        installModule(this, state, [], this._modules.root)
        resetStoreVm(this, state)

        // let state = options.state
        // 如果直接将state定义在实例上 稍后这个状态发生变化 视图是不会更新的
        //getters 其实写得是方法 但是取值的时候是属性
        //defineProperty去定义这个属性
        // this.getters = options.getters
        this.getters = {}
        //通过计算属性有缓存作用
        const computed = {}
        forEachValue(options.getters, (fn, key) => {
            computed[key] = () => {
                return fn(this.state)
            }
            Object.defineProperty(this.getters, key, {
                get: () => this._vm[key]
            })
            // Object.defineProperty(this.getters, key, {
            //     get: () => fn(this.state)
            // })
        })
        this._vm = new Vue({
            data: {
                $$state: state //vue中定义数据，属性名是有特点的  如果属性名是$xxx命名的 他不会被代理vue的实例上 所以用了两个$$
            },
            computed
        })


        //发布订阅模式 将用户定义的action 先保存起来 稍后当调用commit时就找订阅的mutation的方法 调用dispatch就找对应的action方法
        forEachValue(options.mutations, (fn, type) => {
            this._mutations[type] = (payload) => fn.call(this, this.state, payload)
        })

        forEachValue(options.actions, (fn, type) => {
            this._actions[type] = (payload) => fn.call(this, this, payload)
        })

    }
    commit = (type, payload) => {
        this._mutations[type].forEach((fn) => {
            fn(payload)
        })
    }
    dispatch = (type, payload) => {
        this._actions[type].forEach((fn) => {
            fn(payload)
        })
    }
    get state() {
        return this._vm._data.$$state
    }
}
const install = (_Vue) => {
    Vue = _Vue
    appllyMixin(Vue)
}
export {
    Store, install
}