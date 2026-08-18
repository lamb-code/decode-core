import { mergeOptions } from "../utils";

export function initGlobalApi(Vue) {
  //静态方法
  Vue.options = {};
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    console.log(this.options,'ddd')
    return this;
  };
}
