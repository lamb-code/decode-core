//每种虚拟DOM都会对应自己的fiber tag类型
export const HostRoot = 3; //根fiber的tag类型
export const FunctionComponent = 0;
export const ClassComponent = 1;
export const IndeterminateComponent = 2; // Before we know whether it is function or class
export const HostComponent = 5; // 原生Fiber的节点类型
export const HostText = 6;
