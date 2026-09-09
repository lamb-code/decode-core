import React from "react";
import RouterContext from "./RouterContext";
export default class Router extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.history.location,
    };
    //当监听到路由发生变化后会执行
    props.history.listen((location)=>{
        this.setState({location})
    })
  }

  render() {
    let value = {
      history: this.props.history,
      location: this.state.location,
    };
    return (
      <RouterContext.Provider value={value}>
        {this.props.children}
      </RouterContext.Provider>
    );
  }
}
