import { INCREMENT_AUTH, DECREMENT_AUTH } from "./actionTypes";
const initialState = { count: 0 };

export default function counterReducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT_AUTH:
      return { count: state.count + 1 };
    case DECREMENT_AUTH:
      return { count: state.count - 1 };
    default:
      return state;
  }
}
