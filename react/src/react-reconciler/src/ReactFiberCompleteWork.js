import logger from "shared/logger";
import { HostComponent, HostRoot, HostText } from "./ReactWorkTags";
import {
  appendInitialChild,
  createInstance,
  createTextInstance,
  finalizeInitialChildren,
} from "react-dom-bindings/src/client/ReactDOMHostConfig";
import { NoFlags } from "./ReactFiberFlags";
/**
 *把当前的完成的fiber所有子节点对应的真实dom都挂载到自己父parent真实dom节点上
 * @param {*} parent
 * @param {*} workInProgress
 */
function appendAllChildren(parent, workInProgress) {
  let node = workInProgress.child;
  while (node) {
    //如果子节点类型是一个原生节点
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(parent, node.stateNode);
    } else if (node.child !== null) {
      node = node.child;
      continue
    }
    if(node===workInProgress){
      return
    }
    while(node.sibling===null){
      if(node.return ===null||node.return ===workInProgress){
        return
      }
      node = noed.return
    }
    node = node.sibling;
  }
}

export function completeWork(current, workInProgress) {
  logger("completeWork", workInProgress);
  const newProps = workInProgress.pendingProps;
  switch (workInProgress.tag) {
    case HostRoot:
      bubbleProperties(workInProgress)
      break;
    case HostText:
      //如果完成的fiber是文本节点，那就创建真实的文本节点
      const newText = newProps;
      workInProgress.stateNode = createTextInstance(newText);
      bubbleProperties(workInProgress);
      break;
    //如果完成的是原生节点的话
    case HostComponent:
      //创建真实dom
      const { type } = workInProgress;
      const instance = createInstance(type, newProps, workInProgress);
      //把自己所有的儿子都添加到自己的身上
      appendAllChildren(instance,workInProgress);
      workInProgress.stateNode = instance;

      finalizeInitialChildren(instance,type,newProps)
      bubbleProperties(workInProgress);

      break;
    default:
      break;
  }
}
function bubbleProperties(completeWork) {
  let subtreeFlags = NoFlags;
  let child = completeWork.child;
  //遍历当前fiber的所有子节点，把所有的子节点的副作用，以及子节点的子节点的副作用全部合并
  while (child !== null) {
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags;
    child = child.sibling;
  }
  completeWork.subtreeFlags = subtreeFlags;
}
