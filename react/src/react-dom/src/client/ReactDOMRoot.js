import { createContainer,updateContainer } from "react-reconciler/src/ReactFiberReconciler";
function ReactDOMRoot(interalRoot) {
  this._interalRoot = interalRoot;
}
ReactDOMRoot.prototype.render=function(children){
    const root = this._interalRoot
    updateContainer(children,root)
}
export function createRoot(container) {
  const root = createContainer(container);
  return new ReactDOMRoot(root);
}
