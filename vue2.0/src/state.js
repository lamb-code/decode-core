import Dep from "./observe/dep";
import { observe } from "./observe/index";
import Watcher from "./observe/watcher";

export function initState(vm) {
  const opts = vm.$options; //这就是为什么initMixin vm.$options = options; 方便取用户数据
  if (opts.data) {
    initData(vm);
  }
  if (opts.computed) {
    initComputed(vm);
  }
  if (opts.watch) {
    initWatch(vm);
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
function initComputed(vm) {
  const computed = vm.$options.computed;

  let watchers = (vm._computedWatchers = {}); //将计算属性watcher保存到实例上
  for (let key in computed) {
    let userDef = computed[key];
    const fn = typeof userDef === "function" ? userDef : userDef.get;
    //计算属性其实也是一个watcher只是不会立即执行，用lazy变量控制
    watchers[key] = new Watcher(vm, fn, { lazy: true });

    defineComputed(vm, key, userDef);
  }
}
function defineComputed(target, key, userDef) {
  const getter = typeof userDef === "function" ? userDef : userDef.get;
  const setter = userDef.set || (() => {});
  Object.defineProperty(target, key, {
    get: createComputedGetter(key),
    set: setter,
  });
}
function createComputedGetter(key) {
  //把getter包装下，检测是否要执行getter
  return function () {
    const watcher = this._computedWatchers[key];
    if (watcher.dirty) {
      //如果是脏的就去执行用户传入的函数
      watcher.evaluate();
    }
    if (Dep.target) {
      //如果计算属性watcher出栈了，如果还存在渲染watcher，需要让计算属性依赖的值记住这个渲染watcher
      watcher.depend();
    }
    return watcher.value;
  };
}
function initWatch(vm) {
  let watch = vm.$options.watch;
  for (let key in watch) {
    const handler = watch[key]; // 值有字符串 数组 函数 对象 多种情况 这也就是watch多种写法的原因
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler[i]);
    }
  }
}
function createWatcher(vm, key, handler) {
  if (typeof handler === "string") {
    handler = vm[handler];
  }
  return vm.$watch(key,handler)
}
