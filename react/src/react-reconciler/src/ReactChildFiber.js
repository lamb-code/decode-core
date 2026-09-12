import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import { Placement } from "./ReactFiberFlags";
import { createFiberFromElement, createFiberFromText } from "./ReactFiber";
import isArray from "shared/isArray";

export const mountChildFibers = createChildReconciler(false);
export const reconcileChildFibers = createChildReconciler(true);
//shouldTracksiedEffects 是否跟踪副作用
function createChildReconciler(shouldTracksiedEffects) {

  function reconcileSingleElement(returnFiber, currentFirstFiber, element) {
    const created = createFiberFromElement(element);
    created.return = returnFiber;
    return created;
  }
  
  function placeSingleChild(newFiber) {
    if (shouldTracksiedEffects) {
      //要在最后提交阶段插入此节点，React渲染分成 渲染(创建fiber树)和提交(更新真实dom)二个阶段
      newFiber.flags |= Placement;
    }
    return newFiber;
  }

  function createChild(returnFiber, newChild) {
    if (
      (typeof newChild === "string" && newChild !== "") ||
      typeof newChild == "number"
    ) {
      const created = createFiberFromText(`${newChild}`);
      created.return = returnFiber;
      return created;
    }
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          const created = createFiberFromElement(newChild);
          created.return = returnFiber;
          return created;
        }
        default:
          break;
      }
    }
    return null;
  }

  function placeChild(newFiber, newIndex) {
    newFiber.index = newIndex;
    if (shouldTracksiedEffects) {
      newFiber.flags != Placement;
    }
  }

  function reconcileChildrenArray(returnFiber, currentFirstFiber, newChildren) {
    let resultingFirstChild = null;
    let previousNewFiber = null;
    let newIndex = 0;
    for (; newIndex < newChild.length; newIndex++) {
      const newFiber = createChild(returnFiber, newChildren[newIndex]);
      if (newFiber === null) {
        continue;
      }
      placeChild(newFiber, newIndex);
      if(previousNewFiber===null){
        resultingFirstChild=newFiber
      }else{
        previousNewFiber.sibling= newFiber
      }
      previousNewFiber= newFiber
    }
    return resultingFirstChild
  }

  /**
   *
   * @param {*} returnFiber
   * @param {*} currentFirstFiber
   * @param {*} newChild
   * @returns
   */
  function reconcileChildFibers(returnFiber, currentFirstFiber, newChild) {
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(returnFiber, currentFirstFiber, newChild)
          );
        default:
          break;
      }
    }
    if (isArray(newChild)) {
      return reconcileChildrenArray(returnFiber, currentFirstFiber, newChild);
    }
    return null;
  }
  return reconcileChildFibers;
}
