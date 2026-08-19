export function effect(fn, options) {
  //创建一个响应式effect 数据变化可以重新执行
  //创建一个effect 只要依赖的属性变化就要执行回调
  const _effect = new ReactiveEffect(fn, () => {
    _effect.run();
  });
  _effect.run();
  return _effect;
}
export let activeEffect;
class ReactiveEffect {
  _trackId = 0;
  deps = [];
  _depsLength = 0;
  public active = true; //标记是否是响应式 默认是
  constructor(public fn, public scheduler) {}
  run() {
    if (!this.active) {
      return this.fn(); //不是激活的 执行后 什么都不用做
    }
    // activeEffect = this;
    // return this.fn()

    let lastEffect = activeEffect;
    try {
      //为什么需要try,fn执行完之后 activeEffect没有意义了
      activeEffect = this;
      return this.fn();
    } finally {
      activeEffect = lastEffect;
    }
  }
}
export function trackEffect(effect, dep) {
  dep.set(effect, effect._trackId);
  effect.deps[effect._depsLength++] = dep;
}
export function triggerEffects(dep) {
  for (let effect of dep.keys()) {
    if (effect.scheduler) {
      effect.scheduler();
    }
  }
}

/*
    try {
      //为什么需要try,fn执行完之后 activeEffect没有意义了
      activeEffect = this;
      return this.fn();
    } finally {
      activeEffect = undefined;
    }
    为什么还需要lastEffect 考虑下面情况 age 就搜集不到effect
    ###需要重点理解lastEffect,如下面嵌套情况 其实是两套lastEffect 都是记录刚进来run执行时的actvieEffect,最外层记录的是undefined，内部的记录是外层实例，然后互换
    effect(() => {
      console.log(state1.name)
      effect(() => {
        console.log(state1.name)
      })
      console.log(state1.age)
    });
*/
