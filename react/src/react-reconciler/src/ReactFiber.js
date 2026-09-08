import { NoFlags } from "./ReactFiberFlags";
import { HostRoot } from "./ReactWorkTags";

export function FiberNode(tag, pendingProps, key) {
  this.tag = tag;
  this.key = key;
  this.type = null; //fiber类型 来自于虚拟dom节点的type 如 div span p
  this.stateNode = null; //此fiber对应的真实节点
  this.return =null //指向父节点
  this.child=null //指向第一个子节点
  this.sibling=null //指向弟弟
//fiber哪来的？通过虚拟DOM节点创建 虚拟DOM会提供pendingProps用来创建fiber节点属性

  this.pendingProps=pendingProps //等待生效的属性
  this.memoizedProps = null //已经生效的属性

//每个fiber还会有自己的状态 每一种fiber状态存的类型是不一样的
//类组件对应的fiber 存的就是类的实例的状态 HostRoot存的是要渲染的元素
  this.memoizedState = null

  //每个fiber申诉可能还有更新队列
  this.updateQueue = null

  this.flags = NoFlags  //副作用的标识，表示要针对此fiber节点进行何种操作
  this.subtreeFlags = NoFlags //子节点对应的副作用标识
  this.alternate = null
}
function createFiber(tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key);
}
export function createHostRootFiber() {
  return createFiber(HostRoot, null, null);
}
