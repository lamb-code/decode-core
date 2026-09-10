import React from "react";

export default class Lifecycle extends React.Component{
    componentDidMount(){
        this.props.onMount&&this.props.onMount(this)
    }
    render(){
        return null
    }
}