export enum ShapeFlags {
  /** 0：未知类型 */
  ELEMENT = 1, // 0001 普通DOM元素 div、p
  FUNCTIONAL_COMPONENT = 1 << 1, // 0010 函数式组件
  STATEFUL_COMPONENT = 1 << 2, // 0100 有状态组件（.vue单文件组件）
  TEXT_CHILDREN = 1 << 3, // 1000 子节点是文本
  ARRAY_CHILDREN = 1 << 4, // 1 0000 子节点是数组
  SLOTS_CHILDREN = 1 << 5, // 10 0000 子节点是插槽
  TELEPORT = 1 << 6, // 100 0000 Teleport传送门
  SUSPENSE = 1 << 7, // 1000 0000 Suspense
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
  COMPONENT_KEPT_ALIVE = 1 << 9,
  // 组件 = 有状态组件 | 函数式组件
  COMPONENT = STATEFUL_COMPONENT | FUNCTIONAL_COMPONENT,
}
