function bindActionCreator(actionCreator, dispatch) {
  return (...args) => {
    return dispatch(actionCreator.apply(null, args));
  };
}
function bindActionCreators(actionCreators, dispatch) {
  let boundActionCreators = {};
  for (const key in actionCreators) {
    const actionCreator = actionCreators[key];
    boundActionCreators = bindActionCreator(actionCreator, dispatch);
  }
  return boundActionCreators;
}
export default bindActionCreators;
