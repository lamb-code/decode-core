export enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
  RAW = "__v_raw",
}
export enum DirtyLevels {
  Dirty = 4, //脏值  以为这取值要运行计算属性
  NoDirty = 0, //不脏  就用上一次的返回结果
}
