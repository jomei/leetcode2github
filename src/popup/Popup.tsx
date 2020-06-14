import React, {Component} from "react";
import "./Popup.scss";
import LoginForm from "./LoginForm";
import SolutionForm from "./SolutionForm";
import {UserData} from "../gh/GitHub";
import {Solution} from "../lc/Solution";
import {GET_USER_DATA} from "../messages";

interface PopupState {
    loading: boolean
}

export default class Popup extends Component<{}, PopupState> {
    userData: UserData
    solution: Solution
    selectedRepo: string

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
        chrome.runtime.sendMessage({type: GET_USER_DATA}, ({userData: data, solution: solution, repo: repo}) => {
            this.userData = data
            this.solution = solution
            this.selectedRepo = repo
            this.setState({loading: false})
        })
    }

    renderBody() {
        if(this.state.loading) {
            return(<span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true" />)
        }
        if(this.userData.isAuthorized) {
            return <SolutionForm repos={this.userData.repos} solution={this.solution} selectedRepo={this.selectedRepo}/>
        }
        return <LoginForm />
    }
}
