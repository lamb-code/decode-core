import React from "react";
import RouterContext from "./RouterContext";
export default class Route extends React.Component{
    static contextType = RouterContext;
    
    render(){
        const {history,location}=this.context
        const {path,component:RouteComponent}=this.props
        const match = location.pathname===path
        const routeProps = {history,location}
        let element = null
        if(match){
            element=<RouteComponent {...routeProps}/>
        }
        console.log(element,'elemet')
        return element
    }

}