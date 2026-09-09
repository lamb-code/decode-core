export default function applyMiddleware(logger) {
  return function (createStore) {
    return function (reducer) {
      const store = createStore(reducer);
      const dispatch = logger(store)(store.dispatch);
      return { ...store, dispatch };
    };
  };
}
