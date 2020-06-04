import React, {Component} from "react";
import "./Popup.scss";
import LoginForm from "./LoginForm";
import SolutionForm from "./SolutionForm";


interface PopupProps {
    isAuthorized: boolean
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
        if(this.props.isAuthorized) {
            return <SolutionForm />
        }
        return <LoginForm />
    }
}
