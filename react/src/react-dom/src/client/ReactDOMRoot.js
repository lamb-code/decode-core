import { createContainer } from "react-reconciler/src/ReactFiberReconciler";
function ReactDOMRoot(interalRoot) {
  this._interalRoot = interalRoot;
}
export function createRoot(container) {
  const root = createContainer(container);
  return new ReactDOMRoot(root);
}
