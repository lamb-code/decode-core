import { isObject } from "@vue/shared";
import { createVnode, isVnode } from "./createVnode";
/**
 * h() 函数 —— createVNode 的语法糖，用来创建虚拟节点vnode
 * 函数重载：兼容多种传参写法，方便开发者调用
 * 标准签名：h(type, props?, children?)
 * @param {string|Object} type 标签名 / 组件对象
 * @param {Object|Array|string} propsOrChildren 属性对象 或者 子节点(省略props时)
 * @param {string|VNode|Array} children 子节点
 * @returns {VNode} 虚拟节点
 * 
 * h 函数 4 种重载调用场景（对应各个分支）
 * 场景 1：2 个参数，第二个参数是属性对象
 * h('div', {class:'box'})
   len=2 → isObject并且非数组、不是vnode
   createVnode('div', {class:'box'}, null)
 *场景 2：2 个参数，第二个参数是单个子 vnode
 h('div', h('p',null,'hello'))
// len=2，第二个参数是vnode，自动包数组
// createVnode('div', null, [h('p')])
*场景 3：2 个参数，第二个参数是文本 / 子节点数组
h('div','hello world')
h('div', [h('p'),h('p')])
// len=2，直接当做children，props=null
*场景 4：3 个参数
h('div', {class:'box'}, '文本')
h('div', {class:'box'}, h('p')) //单个vnode → 自动包装数组 [vnode]
*场景 5：大于 3 个参数（多子节点简写）
h('div', {}, h('p'), h('p'), h('p'))
// len>3，slice(2)截取后面全部变成子节点数组
 */

export function h(type, propsOrChildren?, children?) {
    // arguments.length 获取实际传入参数的个数，用来做重载分支判断
    let len = arguments.length;
    // ========== 分支一：只传2个参数 h(type, xxx) ==========
    if (len == 2) {
        // 判断第二个参数：是对象，并且不是数组
        if (isObject(propsOrChildren) && !Array.isArray(propsOrChildren)) {
            // 第二个参数本身就是一个vnode虚拟节点
            if (isVnode(propsOrChildren)) {
                // 没有属性，props传null；单个vnode要包成数组，作为子节点
                return createVnode(type, null, [propsOrChildren]);
            } else {
                return createVnode(type, propsOrChildren, null);
            }
        }
        // 剩下两种情况：第二个参数是【字符串文本】或者【vnode数组】
        // 没有属性 props=null，第二个参数直接当做 children
        return createVnode(type, null, propsOrChildren);
    } else {
        // ========== 分支二：参数 >= 3个 ==========
        if (len > 3) {
            // 参数大于3个：h('div',{},a,b,c)，第3位往后全部都是子节点，转为数组
            children = Array.from(arguments).slice(2);
        }
        // len===3，并且第三个参数是单个vnode，包装成数组，统一子节点格式
        if (len === 3 && isVnode(children)) {
            children = [children];
        }
        // 标准三参数调用：type + props + children
        return createVnode(type, propsOrChildren, children);
    }
}
