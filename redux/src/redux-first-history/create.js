import { locationChangeAction } from "./actions";
import { createRouterMiddleware } from "./middleware";
import { createRouterReducer } from "./reducer";

export function createReduxHistoryContext({ history }) {
  const routerMiddleware = createRouterMiddleware(history);
  const routerReducer = createRouterReducer(history);
  function createReduxHistory(store) {
    store.dispatch(locationChangeAction(history.location, history.action));

    history.listen(({ location, action }) => {
      store.dispatch(locationChangeAction(location, action));
    });
    return history;
  }
  return {
    routerMiddleware,
    createReduxHistory,
    routerReducer,
  };
}
