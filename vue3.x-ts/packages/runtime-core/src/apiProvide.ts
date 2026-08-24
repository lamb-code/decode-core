import { currentInstance } from "./component";

export function provide(key, value) {
  // provide inject都是在setup中使用的
  if (!currentInstance) return;
  const parentProvide = currentInstance.parent?.provides; //获取父组件的provide
  let provides = currentInstance.provides;
  if (parentProvide === provides) {
    // 如果在子组件上新增了，provides 需要拷贝一份
    provides = currentInstance.provides = Object.create(provides);
  }
  provides[key] = value;
}
export function inject(key, defaultValue) {
  if (!currentInstance) return;
  const provides = currentInstance.parent?.provides; //获取父组件的provide
  if (provides && key in provides) {
    return provides[key];
  } else {
    return defaultValue;
  }
}
