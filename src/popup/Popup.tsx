import React, {Component} from "react";
import "./Popup.scss";
import LoginForm from "./LoginForm";
import SolutionForm from "./SolutionForm";
import {UserData} from "../gh/GitHub";


interface PopupProps {
    userData: UserData
}

export default class Popup extends Component<PopupProps, {}> {
    constructor(p: PopupProps) {
        super(p);
        this.renderBody = this.renderBody.bind(this)
    }

    render() {
        return (
            <div className="popupContainer">
                {this.renderBody()}
            </div>
        )
    }

    renderBody() {
        if(this.props.userData.isAuthorized) {

            return <SolutionForm repos={this.props.userData.repos}/>
        }
        return <LoginForm />
    }
}
