import { compileToFunction } from "./compiler";
import { initState } from "./state";

//主要为Vue增加_init方法
export function initMixin(Vue) {
  // 后续组件化开发的时候，Vue.extend 可以创造子组件， 子组件可以继承Vue，子组件也可以调用_init 方法
  Vue.prototype._init = function (options) {
    //把用户的选项放vm实例上， 这样在其他方法中都可以获取到options
    //为什么用$开头命名,$data,$nextTick $atrrs... $表示Vue内部变量
    const vm = this;
    vm.$options = options;
    //初始化状态(包括data props，watch computed... )
    initState(vm);
    if (options.el) {
      vm.$mount(options.el);
    }
  };
  Vue.prototype.$mount = function (el) {
    const vm = this;
    el = document.querySelector(el);
    const opts = vm.$options;
    if (!opts.render) {
      let template;
      if (!opts.template && el) {
        template = el.outerHTML;
      } else {
        if (el) {
          template = opts.template;
        }
      }
      if (template) {
        //将模板字符串编译成render函数
        const render = compileToFunction(template);
        opts.render = render;
      }
    }
    // opts.render
  };
}
