export default function applyMiddleware(logger) {
  return function (createStore) {
    return function (reducer) {
      const store = createStore(reducer);
      let dispatch;
      let middlewareAPI = {
        getState: store.getState,
        dispatch: (action) => dispatch(action),
      };
      dispatch = logger(middlewareAPI)(store.dispatch);
      return { ...store, dispatch };
    };
  };
}
