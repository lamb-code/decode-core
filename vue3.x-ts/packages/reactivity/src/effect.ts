export function effect(fn, options) {
  //创建一个响应式effect 数据变化可以重新执行
  //创建一个effect 只要依赖的属性变化就要执行回调
  const _effect = new ReactiveEffect(fn, () => {
    _effect.run();
  });
  _effect.run();
  if(options){
    Object.assign(_effect,options)
  }
  const runner = _effect.run.bind(_effect)
  runner.effect=_effect //在runner方法绑定自己
  // return _effect;
  return runner
}
export let activeEffect;
function preCleanEffect(effect) {
  effect._depsLength = 0;
  effect._trackId++; //每次执行id都是+1 如果当前同一个effect执行id就是相同的
}
function postCleanEffect(effect){
  if(effect.deps.length>effect._depsLength){
    for(let i = effect._depsLength;i<effect.deps.length;i++){
      cleanDepEffect(effect.deps[i],effect)
    }
    effect.deps.length=effect._depsLength
  }
}
class ReactiveEffect {
  _trackId = 0;
  deps = [];
  _depsLength = 0;
  public active = true; //标记是否是响应式 默认是
  constructor(public fn, public scheduler) {} //fn就是effect函数的参数函数
  run() {
    if (!this.active) {
      return this.fn(); //不是激活的 执行后 什么都不用做
    }
    // activeEffect = this;
    // return this.fn()

    let lastEffect = activeEffect;
    try {
      //effect重新执行前需要将上一次的依赖清理,为什么需要清理？
      preCleanEffect(this);

      //为什么需要try,fn执行完之后 activeEffect没有意义了
      activeEffect = this;
      return this.fn();
    } finally {
      activeEffect = lastEffect;
      postCleanEffect(this)
    }
  }
}
function cleanDepEffect(dep, effect) {
  dep.delete(effect);
  if (dep.size == 0) {
    dep.cleanup();
  }
}
export function trackEffect(effect, dep) {
  // dep.set(effect, effect._trackId);
  // //让effect和dep关联起来
  // effect.deps[effect._depsLength++] = dep;

  //effect清零，需要重新搜集依赖 将不需要的移除掉
  // console.log(effect, dep);
  // console.log(dep.get(effect),effect._trackId);
  // 需要理解执行逻辑，_trackId 表示执行轮次
  if (dep.get(effect) != effect._trackId) {
    dep.set(effect, effect._trackId); //更新id
    let oldDep = effect.deps[effect._depsLength];
    if (oldDep != dep) {
      if (oldDep) {
        //如果有老的，先删除老的
        cleanDepEffect(oldDep, effect);
      }
      effect.deps[effect._depsLength++] = dep;
    } else {
      effect._depsLength++;
    }
  }
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
