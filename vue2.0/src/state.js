import { observe } from "./observe/index";

export function initState(vm) {
  const opts = vm.$options; //这就是为什么initMixin vm.$options = options; 方便取用户数据
  if (opts.data) {
    initData(vm);
  }
}
function proxy(vm, key, target) {
  // 取值的时候做代理, 不是暴力的把_data 属性赋值给vm, 而且直接赋值会有命名冲突问题
  Object.defineProperty(vm, key, {
    get() {
      //取值的时候 vm.name 其实还是会走到observe 劫持的数据Object.defineProperty方法去
      return vm[target][key];
    },
    //设置值的时候和取值同理
    set(newValue) {
      vm[target][key] = newValue;
    },
  });
}
function initData(vm) {
  let data = vm.$options.data;
  // 如果用户传递的是一个函数,则取函数的返回值作为对象, 如果就是对象就直接使用那个对象
  data = vm._data = typeof data === "function" ? data.call(vm) : data || {}; //这就是为什么使用vue data 可以是对象也可以是函数

  //对数据进行劫持，也就是数据响应式 VUE2采用了api Object.defineProperty
  observe(data);
  // vm._data 用vm代理
  for (let key in data) {
    // 用户传的options里data，使用vue 一般都是vm.name但是没有这个属性 因此通过代理 // vm._data 用vm代理
    proxy(vm, key, "_data");
  }
}
