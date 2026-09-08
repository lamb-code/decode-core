import { createUpdate, enqueueUpdate } from "./ReactFiberClassQueue";
import { createFiberRoot } from "./ReactFiberRoot";
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";

export function createContainer(containerInfo) {
  return createFiberRoot(containerInfo);
}
// 更新容器
export function updateContainer(element, container) {
  //获取当前的根fiber
  const current = container.current;
  //创建更新
  const update = createUpdate();
  //需要更新的虚拟DOM
  update.payload = { element };
  //把此更新对象添加到current这个根fiber的更新队列上 返回根节点
  let root = enqueueUpdate(current, update);
  scheduleUpdateOnFiber(root);
}
