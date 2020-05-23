import React, { Component } from "react";
import "./Button.scss";

class Button extends Component<any, any> {
    render() {
        return(<button onClick={this.props.onClick}> {this.props.text} </button>)
    }
}

export { Button }
