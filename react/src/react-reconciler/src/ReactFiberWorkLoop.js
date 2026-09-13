// import { scheduleCallback } from "scheduler";
import { scheduleCallback } from "scheduler";
import { createWorkInProgress } from "./ReactFiber";
import { beginWork } from "./ReactFiberBeginWork";
import { completeWork } from "./ReactFiberCompleteWork";
let workInProgress = null;

export function scheduleUpdateOnFiber(root) {
  //确保调度执行root上的更新
  ensureRootIsSchduled(root);
}
function ensureRootIsSchduled(root) {
  //告诉浏览器要执行performConcurentWorkOnRoot此函数
  scheduleCallback(performConcurentWorkOnRoot.bind(null, root));
}
//根据fiber构建fiber树 要创建真实DOM节点 还需要把真实的DOM节点插入容器
function performConcurentWorkOnRoot(root) {
  //以同步的方式渲染根节点 初次渲染的时候 都是同步
  renderRootSync(root);
  console.log(root,'mmmmmmmmmmmm')
}
function prepareFreshStack(root) {
  workInProgress = createWorkInProgress(root.current, null);
  // console.log(workInProgress);
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
  //获取新fiber对应的老fiber
  const current = unitOfWork.alternate;
  //完成当前fiber的子fiber链表构建后
  const next = beginWork(current, unitOfWork);
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  if (next == null) {
    //如果没有子节点标识当前的fiber已经完成了
    completeUnitOfWork(unitOfWork);
    // workInProgress=null
  }else{
    //如果有子节点就让子节点成为下一个工作单元
    workInProgress=next
  }
}

function completeUnitOfWork(unitOfWork){
  let completedWork = unitOfWork
  do{
    const current = completedWork.alternate
    const returnFiber =completedWork.return
    completeWork(current,completedWork)
    const siblingFiber = completedWork.sibling
    if(siblingFiber!==null){
      workInProgress = siblingFiber
      return
    }
    //如果没有弟弟，说明这当前完成的就是父Fiber的最后一个节点
    completedWork=returnFiber
    workInProgress=completedWork

  }while(completedWork!==null){

  }

}