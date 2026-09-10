import React from "react";
import {Router} from "../react-router";
import { createBrowserHistory } from "../history/createBrowserHistory";
export default class BrowserRouter extends React.Component{
    history = createBrowserHistory(this.props)
    render(){
        return <Router history={this.history}>{this.props.children}</Router>
    }
}