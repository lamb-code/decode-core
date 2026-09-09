import { createStoreImpl } from "./vanilla";
import { useSyncExternalStore, useRef, useCallback } from "react";
export function useStore(api, selector=(s)=>s) {
  const lastSnapshotRef = useRef(null);
  const lastSelectionRef = useRef(null);
  const getSnapshot = useCallback(() => {
    let lastSelection = lastSnapshotRef.current;
    if (lastSelection === null) {
      const nextSnapShot = api.getState();
      const newSelection = selector(nextSnapShot);
      lastSelectionRef.current = newSelection;
      lastSnapshotRef.current = nextSnapShot;
      return newSelection;
    }else{
        const lastSnapShot = lastSnapshotRef.current
        const nextSnapShot = api.getState()
        if(Object.is(lastSnapShot,nextSnapShot)){
            return lastSelection
        }
    }
  }, []);
  let value = useSyncExternalStore(api.subscribe, getSnapshot);
  return value;
}
export const create = (createState) => {
  const api = createStoreImpl(createState);
  return (selector) => useStore(api, selector);
};

export default create;
