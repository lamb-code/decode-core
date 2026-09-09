import React from "react";
import store from "../../store";
import actionCreators from "../../store/actionCreators/auth";
import { bindActionCreators } from "../../redux";
// export default function () {
//   const { count } = store.getState().auth;
//   return (
//     <div style={{ padding: 24, fontFamily: "sans-serif" }}>
//       <h2>手写 Redux Counter--Auth</h2>
//       <div style={{ fontSize: 40, fontWeight: 700 }}>{count}</div>
//       <button onClick={() => store.dispatch({ type: "INCREMENT_AUTH" })}>
//         +1
//       </button>
//       <button onClick={() => store.dispatch({ type: "DECREMENT_AUTH" })}>
//         -1
//       </button>
//     </div>
//   );
// }
const bundActionCreators = bindActionCreators(actionCreators, store.dispatch);
class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: store.getState().auth.count };
  }
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.setState({
        count: store.getState().auth.count,
      });
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    return (
      <div style={{ padding: 24, fontFamily: "sans-serif" }}>
        <h2>手写 Redux Counter--Auth</h2>
        <div style={{ fontSize: 40, fontWeight: 700 }}>{this.state.count}</div>
        <button onClick={() => store.dispatch({ type: "INCREMENT_AUTH" })}>
          +1
        </button>
        <button onClick={bundActionCreators.authInc}>creator +1</button>
        <button onClick={() => store.dispatch({ type: "DECREMENT_AUTH" })}>
          -1
        </button>
      </div>
    );
  }
}
export default Auth;
