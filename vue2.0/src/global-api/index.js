import { mergeOptions } from "../utils";

export function initGlobalApi(Vue) {
  //静态方法
  Vue.options = {
    _base: Vue,
  };
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    console.log(this.options, "ddd");
    return this;
  };
  //就是实现根据用户参数返回一个构造函数
// 返回一个子类，而且会在子类记录自己的选项
  Vue.extend = function (options) {
    //最终使用一个组件就是new 一个实例
    function Sub(options = {}) {
      this._init(options);
    }
    Sub.prototype = Object.create(Vue.prototype);
    Sub.prototype.constructor = Sub;
    Sub.options =mergeOptions(Vue.options,options) ;
    return Sub;
  };
  Vue.options.components = {};
  // 作用就是搜集全局定义 id 和对应的definition Vue.component[组件名] = 包装成构造函数(定义)
  Vue.component = function (id, definition) {
    //如果definition已经是一个函数，说明用户自己调用了Vue.extend
    definition =
      typeof definition === "function" ? definition : Vue.extend(definition);
    Vue.options.components[id] = definition;
  };
}
