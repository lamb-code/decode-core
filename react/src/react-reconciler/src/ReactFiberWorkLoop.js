import { scheduleCallback } from "scheduler";
import { createWorkInProgress } from "./ReactFiber";
import { beginWork } from "./ReactFiberBeginWork";
let workInProgress = null;

export function scheduleUpdateOnFiber(root) {
  //确保调度执行root上的更新
  ensureRootIsSchduled(root);
}
function ensureRootIsSchduled(root) {
  scheduleCallback(performConcurentWorkOnRoot.bind(null, root));
}
//根据fiber构建fiber树 要创建真实DOM节点 还需要把真实的DOM节点插入容器
function performConcurentWorkOnRoot(root) {
  //以同步的方式渲染根节点 初次渲染的时候 都是同步
  renderRootSync(root);
}
function prepareFreshStack(root) {
  workInProgress = createWorkInProgress(root.current, null);
  console.log(workInProgress);
}
function renderRootSync(root) {
  //开始构建fiber树
  prepareFreshStack(root);
  workLoopSync()
}
function workLoopSync() {
  while (workInProgress != null) {
    performUnitOfWork(workInProgress);
  }
}
function performUnitOfWork(unitOfWork) {
  const current = unitOfWork.alternate;
  const next = beginWork(current, unitOfWork);
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  if (next == null) {
    // completeUnitOfWork(unitOfWork);
    workInProgress=null
  }else{
    workInProgress=next
  }
}
