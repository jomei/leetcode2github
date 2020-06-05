import React, {Component} from "react";
import "./LoginForm.scss";
import {AUTH_START} from "../const";

export default class LoginForm extends Component<{}, {}> {
    constructor(props) {
        super(props);
        this.onSingInClick = this.onSingInClick.bind(this)
    }

    render() {
        return(
            <div className="loginForm">
                <p>Let's authorize with GitHub first</p>
                <button className="btn btn-primary" onClick={this.onSingInClick}>Sign in</button>
            </div>
        )
    }

    onSingInClick() {
        return chrome.runtime.sendMessage({ event: AUTH_START})
    }
}
