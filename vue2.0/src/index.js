import { initGlobalApi } from "./global-api";
import { initMixin } from "./init";
import { lifecycleMixin } from "./lifeCycle";
import { nextTick } from "./observe/watcher";
function Vue(options) {
  // 初始化操作
  this._init(options); // 此方法是通过initMixin 方法里的Vue.prototype._init 方法定义的
}
Vue.prototype.$nextTick = nextTick;
initMixin(Vue); // 将 _init 方法添加到 Vue 实例原型上，供 Vue 实例调用
lifecycleMixin(Vue);
initGlobalApi(Vue)

export default Vue;
