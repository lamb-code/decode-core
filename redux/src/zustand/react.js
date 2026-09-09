import { createStoreImpl } from "./vanilla";
import { useSyncExternalStore } from "react";
export function useStore(api) {
  let value = useSyncExternalStore(api.subscribe, api.getState);
  return value;
}
export const create = (createState) => {
  const api = createStoreImpl(createState);
  return () => useStore(api);
};

export default create;
