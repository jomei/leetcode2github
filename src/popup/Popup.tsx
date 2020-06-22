import React, {Component} from "react";
import "./Popup.scss";
import LoginForm from "./LoginForm";
import SolutionForm from "./SolutionForm";
import {UserData} from "../gh/GitHub";
import {Solution} from "../lc/Solution";
import {GET_USER_DATA} from "../messages";
import {Settings, SettingsForm} from "./SettingsForm";

interface PopupState {
    loading: boolean
}

export default class Popup extends Component<{}, PopupState> {
    userData: UserData
    solution: Solution
    selectedRepo: string
    settings: Settings

    constructor(p: {}) {
        super(p);
        this.renderBody = this.renderBody.bind(this)
        this.state = {loading: true}
    }

    render() {
        return (
            <div className="popupContainer">
                {this.renderBody()}
            </div>
        )
    }

    componentDidMount() {
        chrome.runtime.sendMessage({type: GET_USER_DATA}, ({userData: userData, settings: settings}) => {
            this.userData = userData
            this.settings = settings
            this.setState({loading: false})
        })
    }

    renderBody() {
        if(this.state.loading) {
            return(<span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true" />)
        }
        // if(this.userData.isAuthorized) {
        //     return <SolutionForm repos={this.userData.repos} solution={this.solution} selectedRepo={this.selectedRepo}/>
        // }
        if(this.userData.isAuthorized) {
            return <SettingsForm settings={this.settings} repos={this.userData.repos} />
        }
        return <LoginForm />
    }
}
