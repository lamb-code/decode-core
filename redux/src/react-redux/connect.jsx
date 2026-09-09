import React from "react";
import ReactReduxContext from "./ReactReduxContext";
import { bindActionCreators } from "../redux";

function connect(mapStateToProps, mapDispatchToProps) {
  return function (OldComponent) {
    return class extends React.Component {
      static contextType = ReactReduxContext;
      constructor(props, context) {
        super(props);
        const { store } = context;
        const { getState, subscribe, dispatch } = store;
        this.state = mapStateToProps(getState());
        this.unsubscribe = subscribe(() => {
          this.setState(mapStateToProps(getState()));
        });
        let dispatchProps;
        if (typeof mapDispatchToProps === "function") {
          dispatchProps = mapDispatchToProps(dispatch);
        } else {
          dispatchProps = bindActionCreators(mapDispatchToProps, dispatch);
        }
        this.dispatchProps = dispatchProps;
      }
      componentWillUnmount() {
        this.unsubscribe();
      }
      render() {
        return (
          <OldComponent
            {...this.props}
            {...this.state}
            {...this.dispatchProps}
          />
        );
      }
    };
  };
}
export default connect;
