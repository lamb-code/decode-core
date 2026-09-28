import { mergeOptions } from "../utils";

export function initGlobalApi(Vue) {
  //静态方法
  Vue.options = {
    _base:Vue
  };
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    console.log(this.options, "ddd");
    return this;
  };
  //就是实现根据用户参数返回一个构造函数
  Vue.extend = function (options) {
    //最终使用一个组件就是new 一个实例
    function Sub(options = {}) {
      this._init(options);
    }
    Sub.prototype = Object.create(Vue.prototype);
    Sub.prototype.constructor = Sub;
    Sub.options = options;
    return Sub;
  };
  Vue.options.components = {};
  Vue.component = function (id, definition) {
    //如果definition已经是一个函数，说明用户自己调用了Vue.extend
    definition = typeof definition ==='function'?definition:Vue.extend(definition)
    Vue.options.components[id] = definition;
  };
}
