import React, { Component } from "react";
import "./Button.scss";

interface ButtonProps {
    onClick();
    text: string;
}

class Button extends Component<ButtonProps, any> {
    render() {
        return(<button onClick={this.props.onClick}> {this.props.text} </button>)
    }
}

export { ButtonProps, Button }
