import React, {Component} from "react";
import {AUTH_START} from "../messages";

export default class LoginForm extends Component<{}, {}> {
    constructor(props) {
        super(props);
        this.onSingInClick = this.onSingInClick.bind(this)
    }

    render() {
        return(
            <div className="loginForm">
                <button className="btn btn-large btn-success" onClick={this.onSingInClick}>Sign in <i className="icon-github-circled" /></button>
            </div>
        )
    }

    onSingInClick() {
        return chrome.runtime.sendMessage({ type: AUTH_START})
    }
}
