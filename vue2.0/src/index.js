import { initGlobalApi } from "./global-api";
import { initMixin } from "./init";
import { lifecycleMixin } from "./lifeCycle";
import { initStateMixin } from "./state";
function Vue(options) {
  // 初始化操作
  this._init(options); // 此方法是通过initMixin 方法里的Vue.prototype._init 方法定义的
}
initMixin(Vue); // 将 _init 方法添加到 Vue 实例原型上，供 Vue 实例调用
lifecycleMixin(Vue);
initGlobalApi(Vue); //全局api的实现
initStateMixin(Vue) //实现了nexttick $watch


export default Vue;
