import { HostRoot } from "./ReactWorkTags";

//向上找到根节点
export function markUpdateLaneFromFiberToRoot(sourceFiber) {
  let node = sourceFiber;
  let parent = sourceFiber.return;
  while (parent != null) {
    node = parent;
    parent = parent.return;
  }
  //一直找到parent为null
  if(node.tag===HostRoot){
    return node.stateNode;
  }
  return null
}
