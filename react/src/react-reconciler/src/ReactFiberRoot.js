
import { createHostRootFiber } from "./ReactFiber";
import { initialUpdateQueue } from "./ReactFiberClassQueue";
function FiberRootNode(containerInfo) {
  this.containerInfo = containerInfo;
}

export function createFiberRoot(containerInfo) {
  const root = new FiberRootNode(containerInfo);
  //HostRoot指的就是根节点 div#root
  const uninitializedFiber = createHostRootFiber();
  //root就是根容器的current指向当前的根fiber
  root.current = uninitializedFiber
  //根fiber的stateNode也就是真实DOM节点指向FiberRootNode
  uninitializedFiber.stateNode = root
  initialUpdateQueue(uninitializedFiber)
  return root;
}
