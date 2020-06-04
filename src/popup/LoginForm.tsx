import React, {Component} from "react";
import {AUTH_START} from "../const";

export default class LoginForm extends Component<{}, {}> {
    constructor(props) {
        super(props);
        this.onSingInClick = this.onSingInClick.bind(this)
    }

    render() {
        return(
            <div>
                <p>Wow! It seems like you aren't signed in to GitHub!</p>
                <button onClick={this.onSingInClick}>Sign in</button>
            </div>
        )
    }

    onSingInClick() {
        return chrome.runtime.sendMessage({ event: AUTH_START})
    }
}
