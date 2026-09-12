import logger from "shared/logger";
import { HostComponent, HostRoot, HostText } from "./ReactWorkTags";
import assign from "shared/assign";
import { shouldSetTextContent } from "react-dom-bindings/src/ReactDOMHostConfig";
import { mountChildFibers, reconcileChildFibers } from "./ReactChildFiber";
import { processUpdateQueue } from "./ReactFiberClassQueue";
function reconcileChildren(current, workInProgress, nextChildren) {
  //如果此新fiber没有老fiber 说明此新fiber是新创建的
  if (current === null) {
    //mountChildFibers
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren);
  } else {
    //如果说有老fiber的话，做DOM-DIFF拿老的fiber链表和新的子虚拟DOM进行比较 进行最小化的更新
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren
    );
  }
}
//目标是根据虚拟DOM构建新的fiber链表
function updateHostRoot(current, workInProgress) {
  //需要知道它的子虚拟dom 知道它儿子的虚拟dom信息(在他的更新队列里)
  processUpdateQueue(workInProgress);
  const nextState = workInProgress.memoizedState;
  const nextChildren = nextState.element;
  //协调子节点 DOM-DIFF算法就在此方法里
  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}
/**
 * 构建原生组件的子fiber链表
 * @param {*} current 老fiber
 * @param {*} workInProgress 新fiber h1
 */
function updateHostComponent(current, workInProgress) {
  const {type}=workInProgress
  const nextProps = workInProgress.pendingProps;
  let nextChildren = nextProps.nextChildren
  const isDirectTextChild = shouldSetTextContent(type,nextProps)
  if(isDirectTextChild){
    nextChildren= null
  }
  reconcileChildren(current,workInProgress,nextChildren)
  return workInProgress.child
}
export function beginWork(current, workInProgress) {
  logger("beginWork", workInProgress);
  switch (workInProgress.tag) {
    case HostRoot:
      return updateHostRoot(current, workInProgress);
    case HostComponent:
      return updateHostComponent(current, workInProgress);
    case HostText:
      return null;
    default:
      return null;
  }
}
