export const createStoreImpl = (createState) => {
  let state;
  let listeners = new Set();
  const getState = () => state;
  const setState = (partial) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      let previousState = state;
      state = Object.assign({}, previousState, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const api = {
    getState,
    setState,
    subscribe,
  };
  state = createState(setState,getState,api);
  return api;
};
