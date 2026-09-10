import React from "react";
import {Router} from "../react-router";
// import { createHashHistory } from "history";
import { createHashHistory } from "history/cjs/history";

export default class HashRouter extends React.Component {
  history = createHashHistory(this.props);
  
  render() {
    return <Router history={this.history}>{this.props.children}</Router>;
  }
}
