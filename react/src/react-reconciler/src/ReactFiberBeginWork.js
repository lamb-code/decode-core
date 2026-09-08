import logger from "shared/logger";
import { HostComponent, HostRoot, HostText } from "./ReactWorkTags";
function updateHostRoot(current, workInProgress) {
  //需要知道它的子虚拟dom 知道它儿子的虚拟dom信息(在他的更新队列里)
  processUpdateQueue(workInProgress);
  const nextState = workInProgress.memoizedState
  const nextChildren = nextState.element;
  //协调子节点
   reconcileChildren(current,workInProgress,nextChildren)
   return workInProgress.child
}
function updateHostComponent(current, workInProgress) {}
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
