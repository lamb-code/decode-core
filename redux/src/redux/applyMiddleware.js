import compose from "./compose";

export default function applyMiddleware(...middlewares) {
  return function (createStore) {
    return function (reducer, preloadedState) {
      const store = createStore(reducer, preloadedState);
      let dispatch;
      let middlewareAPI = {
        getState: store.getState,
        dispatch: (action) => dispatch(action),
      };
      let chain = middlewares.map((middleware) => middleware(middlewareAPI));

      // dispatch = logger(middlewareAPI)(store.dispatch);
      dispatch = compose(...chain)(store.dispatch);
      return { ...store, dispatch };
    };
  };
}
