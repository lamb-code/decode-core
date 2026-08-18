export function initState(vm) {
  const opts = vm.$options; //这就是为什么initMixin vm.$options = options; 方便取用户数据
  if (opts.data) {
    initData(vm);
  }
}
function initData(vm) {
  let data = vm.$options.data;
  // 如果用户传递的是一个函数,则取函数的返回值作为对象, 如果就是对象就直接使用那个对象
  data = vm._data = typeof data === "function" ? data.call(vm) : data || {}; //这就是为什么使用vue data 可以是对象也可以是函数

  //对数据进行劫持，也就是数据响应式 VUE2采用了api Object.defineProperty
}
