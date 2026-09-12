import assign from "shared/assign";
import { markUpdateLaneFromFiberToRoot } from "./ReactFiberConcurrentUpdates";
export const UpdateState = 0;
export function initialUpdateQueue(fiber) {
  //创建一个新的更新队列
  //pending其实是一个循环链接
  const queue = {
    shared: {
      pending: null,
    },
  };
  fiber.updateQueue = queue;
}

export function createUpdate() {
  const update = {tag:UpdateState};
  return update;
}

export function enqueueUpdate(fiber, update) {
  const updateQueue = fiber.updateQueue;
  const pending = updateQueue.shared.pending;
  //pending不是指向 "第一个"，而是永远指向最后一个（队尾）；pending.next 才是第一个（队头）。
  if (pending == null) {
    update.next = update; // 空队：新节点自己指向自己，成环
  } else {
    update.next = pending.next; //新节点的 next = 现在的队头（插到队尾后面）
    pending.next = update; //原队尾的 next 指向新节点（它成为新队尾）
  }
  updateQueue.shared.pending = update; // pending 指针更新为新队尾
  return markUpdateLaneFromFiberToRoot(fiber);
}

//根据老状态和更新队列中的更新计算最新的状态
export function processUpdateQueue(workInProgress) {
  const queue = workInProgress.updateQueue;
  const pendigQueue = queue.shared.pending;
  //如果有更新 或者说更新队列里有内容
  if (pendigQueue !== null) {
    queue.shared.pending = null;
    //获取更新队列中最后一个更新 update={payload:{element:h1}}
    const lastPendingUpdate = pendigQueue;
    //指向第一个更新
    const firstPendingUpdate = lastPendingUpdate.next;
    //把更新链表剪开变成一个单链表
    lastPendingUpdate.next = null;
    //获取老状态 第一次是null
    let newState = workInProgress.memoizedState;
    let update = firstPendingUpdate;
    while (update) {
      newState = getStateFromUpdate(update, newState);
      update = update.next;
    }
    workInProgress.memoizedState = newState;
  }
}

/**
 * 
 * @param {*} update 
 * @param {*} prevState 
 * @returns 
 */
function getStateFromUpdate(update, prevState) {
  
  switch (update.tag) {
    case UpdateState:
      const { payload } = update;
      return assign({}, prevState, payload);
    default:
      break;
  }
}
