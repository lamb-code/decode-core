import { applyMiddleware, combineReducers, createStore } from "../redux";
import { thunk } from "../redux/middleware";
function isPlainObject(value) {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  return Object.getPrototypeOf(value) === Object.prototype;
}
function configureStore(options = {}) {
  let { reducer, middleware = [thunk], preloadedState } = options;
  let rootReducer;
  if (typeof reducer === "function") {
    rootReducer = reducer;
  } else if (isPlainObject(reducer)) {
    rootReducer = combineReducers(reducer);
  }
  return createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(...middleware)
  );
}
export default configureStore;
