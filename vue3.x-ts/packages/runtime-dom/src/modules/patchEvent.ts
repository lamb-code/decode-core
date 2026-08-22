/**
 * createInvoker创建事件调用器外壳函数描述:
 * @description 生成一个固定引用的包装壳函数；真实的事件回调挂载在 invoker.value 属性上。
 * 触发事件时外壳内部惰性读取最新的回调执行。更新回调只需修改 .value，无需解绑、重新绑定DOM事件，减少性能开销。
 * @param {Function} value - 用户传入原始事件回调
 * @returns {Function} invoker 外壳函数
 * 思路原理：
 * 1.(e) => invoker.value(e) 只是定义函数，不会立刻执行函数体；触发时才读取最新 .value → 惰性取值
 * 2.函数也是对象，延后赋值 invoker.value = value，保存真实回调
 * 3.箭头函数捕获外层变量 invoker，形成闭包；但热替换能力来自对象属性，不是闭包
 */
function createInvoker(value) {
  // 第1步：创建变量 invoker（此时只是变量，值为 undefined）
  // 第2步：把箭头函数赋值给 invoker
  const invoker = (e) => invoker.value(e);
  // 第3步：给 invoker（它是一个函数对象）添加 .value 属性
  invoker.value = value;
  return invoker;
}
/**
 * patchEvent 事件补丁描述参数:
 * @description 给元素绑定/更新/移除事件；使用invoker外壳实现回调热替换，避免频繁add/removeEventListener
 * @param {HTMLElement} el - 需要操作的DOM元素
 * @param {string} name - Vue事件属性名 例如: onClick、onInput
 * @param {Function|null} nextValue - 最新的事件回调函数；null代表移除事件
 * @property {Object} el._vei - DOM缓存仓库，存储该元素所有事件对应的invoker外壳函数 (Vue‑Event‑Invokers)
 * 思路原理：
 * 1.DOM 元素身上挂缓存 _vei，记住每个事件对应的 invoker 外壳函数
 * 2.壳子 (invoker) 只绑定一次到 DOM，addEventListener 绑定的永远是这个外壳函数，后续壳子引用从头到尾不变。
 * 3.用户真正的回调函数存放在壳子的 .value 属性上
 * 4.更新的时候，不去动 DOM 的事件监听，仅仅替换 invoker.value = 新函数。于是跳过昂贵流程：removeEventListener → addEventListener
 */
export default function patchEvent(el, name, nextValue) {
  // invokers 与 el._vei 指向【同一个对象引用】，invokers只是el._vei的本地别名；
  // el._vei挂载在DOM元素上，作为长期缓存仓库，存放各个事件对应的invoker外壳函数；
  // 修改invokers的属性等价于修改el._vei，数据会永久保存在DOM身上，跨patchEvent调用可读取。
  const invokers = el._vei || (el._vei = {}); // 获取当前DOM身上缓存的事件调用器对象，不存在则初始化空对象

  // 截取事件名称，onClick → click
  const eventName = name.slice(2).toLowerCase();
  // 获取该事件旧的外壳函数
  const exisitingInvokers = invokers[name];
  // 场景1: 已有外壳 && 传入新回调 → 热替换回调，不解绑DOM事件(最高效路径)
  if (nextValue && exisitingInvokers) {
    return (exisitingInvokers.value = nextValue);
  }
  // 场景2: 首次绑定事件，创建invoker外壳，添加DOM事件监听
  if (nextValue) {
    const invoker = (invokers[name] = createInvoker(nextValue));
    return el.addEventListener(eventName, invoker);
  }
  // 场景3: nextValue为空，移除事件，解绑外壳并清空缓存
  if (exisitingInvokers) {
    el.removeEventListener(eventName, exisitingInvokers);
    invokers[name] = undefined;
  }
}
