import runSaga from "./runSaga";

function createSagaMiddleware() {
  function sagaMiddleware() {
    return function (next) {
      return function (action) {
        const result = next(action);
        return result;
      };
    };
  }
  sagaMiddleware.run=(saga)=>runSaga(saga)
  return sagaMiddleware
}
export default createSagaMiddleware;
