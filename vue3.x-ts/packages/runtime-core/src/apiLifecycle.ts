import { currentInstance, setCurrentInstance, unsetCurrentInstance } from "./component";

export const enum LifeCycle {
  BEFORE_MOUNT = "bm",
  MOUNTED = "m",
  BEFORE_UPDATE = "bu",
  UPDATED = "u",
}
function createHook(type) {
  //将全局当前实例存到了此钩子上
  return (hook, target = currentInstance) => {
    // console.log(type, hook);
    if (target) {
      const hooks = target[type] || (target[type] = []);
      //在执行函数内部怎么保证实例是正确？因为setup执行完毕后就会将将instance清空,利用闭包产生高阶函数存之前target
      const wrapHook=()=>{
        // 把当前target 设置当前全局实例()
        setCurrentInstance(target)
        hook.call(target)
        unsetCurrentInstance()
      }
    //   hooks.push(hook)
    hooks.push(wrapHook)
    }
  };
}
export const onBeforeMount = createHook(LifeCycle.BEFORE_MOUNT);
export const onMounted = createHook(LifeCycle.MOUNTED);
export const onBeforeUpdate = createHook(LifeCycle.BEFORE_UPDATE);
export const onUpdated = createHook(LifeCycle.UPDATED);
export function invokeArray(fns){
    for(let i =0;i<fns.length;i++){
        fns[i]()
    }
}
