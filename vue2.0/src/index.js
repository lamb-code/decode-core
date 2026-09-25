import { compileToFunction } from "./compiler";
import { initGlobalApi } from "./global-api";
import { initMixin } from "./init";
import { lifecycleMixin } from "./lifeCycle";
import { initStateMixin } from "./state";
import { createElm, patch } from "./vdom/patch";
function Vue(options) {
  // 初始化操作
  this._init(options); // 此方法是通过initMixin 方法里的Vue.prototype._init 方法定义的
}
initMixin(Vue); // 将 _init 方法添加到 Vue 实例原型上，供 Vue 实例调用
lifecycleMixin(Vue);
initGlobalApi(Vue); //全局api的实现
initStateMixin(Vue); //实现了nexttick $watch

//--------------------测试代码
let render1 = compileToFunction(`<ul style="color:red">
<li key="d">d</li>
<li key="a">a</li>
<li key="b">b</li>
<li key="c">c</li>
</ul>`);
let vm1 = new Vue({ data: { name: "jane" } });
let prevVnode = render1.call(vm1);

let el = createElm(prevVnode);
document.body.appendChild(el);

let render2 = compileToFunction(
  `<ul style="color:red;background:blue">
  <li key="a">a</li>
  <li key="b">b</li>
  <li key="c">c</li>

  </ul>`
);
let vm2 = new Vue({ data: { name: "tau" } });
let nextVnode = render2.call(vm2);
// 直接将新的节点替换掉了老的，不是直接替换而是比较两个人的区别之后再替换 diff算法
//diff算法是一个平级比较的过程 父亲和父亲比对 儿子和儿子比对
setTimeout(() => {
  // let newEl = createElm(nextVnode);
  // el.parentNode.replaceChild(newEl, el);
  patch(prevVnode, nextVnode);
}, 2000);

export default Vue;
