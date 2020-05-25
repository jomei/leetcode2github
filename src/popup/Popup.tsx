import React, {Component, ReactNode} from "react";
import {Button} from "../kit";
import {Octokit} from "@octokit/rest";
import "./Popup.scss";

interface PopupState {
    showLogin: boolean
}

export default class Popup extends Component<{}, PopupState> {
  constructor(p: {}) {
    super(p);
    this.state = {
        showLogin: false
    }
    this.handleClick = this.handleClick.bind(this)
    this.renderBody = this.renderBody.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
  }

    render() {
    return(
        <div className="popupContainer">
            {this.renderBody()}
        </div>
    )
  }

  renderBody(): ReactNode  {
      if(this.state.showLogin) {
          return(<div className="form">
              <Button onClick={this.handleLogin} text="login" />
          </div>)
      }

      return(<Button onClick={this.handleClick}  text="TEST Login" />)
  }

  handleClick() {
    this.setState({showLogin: true})
  }

  handleLogin() {
      this.setState({showLogin:false})
  }
}
