import createAction from "./createAction";
import createReducer from "./createReducer";
function getType(slice, actionKey) {
  return slice + "/" + actionKey;
}

export default function createSlice(options) {
  const { name, initialState, reducers } = options;
  let actions = {};
  let prefixReducers = {};
  Object.keys(reducers).forEach((key) => {
    let type = getType(name, key);
    actions[key] = createAction(type);
    prefixReducers[type] = reducers[key];
  });
  let reducer = createReducer(initialState, prefixReducers);
  return {
    actions,
    reducer,
  };
}

/**
 * 其实为了区分不同分片的动作类型
 * 不同分片，它的动作类型可以是一样的
 * name 指的是命名空间
 */
