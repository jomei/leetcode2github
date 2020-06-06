import React, {Component} from "react";
import {CommitPayload} from "../gh/GitHub";
import {SOLUTION_SUBMIT} from "../messages";

export interface SolutionState {
    commit: CommitPayload
    loading: boolean,
    showSuccess: boolean,
    showError: boolean
}

//
// export interface SolutionProps {
//     onSubmit()
//     onCancel()
// }

export default class SolutionForm extends Component<{}, SolutionState> {
    constructor(props) {
        super(props);

        this.onCommitFieldChange = this.onCommitFieldChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onBackClick = this.onBackClick.bind(this)
        this.state = {
            commit: {
                repo: "",
                fileName: "",
                message: "",
                content: ""
            },
            loading: false,
            showSuccess: false,
            showError: false
        }
    }

    render() {
        if(this.state.showError) {
            return(
                <div className="text-center">
                    <p>Solution commit failed =(</p>
                    <button className="btn btn-large btn-primary" onClick={this.onBackClick}>Try again</button>
                </div>
            )
        }

        if(this.state.showSuccess) {
            return(
                <div className="text-center">
                    <p>Solution committed successfully!</p>
                    <button className="btn btn-large btn-success" onClick={this.onBackClick}>Nice!</button>
                </div>
            )
        }
        return (
            <div>
                <p>Save solution</p>
                <div className="form-group">
                    <input type="text" className="form-control" name="repo" value={this.state.commit.repo}
                           placeholder="Repository"
                           disabled={this.state.loading}
                           onChange={this.onCommitFieldChange} required/>
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" name="fileName" value={this.state.commit.fileName}
                           placeholder="File name"
                           disabled={this.state.loading}
                           onChange={this.onCommitFieldChange} required/>
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" name="message" value={this.state.commit.message}
                           placeholder="Message"
                           disabled={this.state.loading}
                           onChange={this.onCommitFieldChange} required/>
                </div>
                <div className="form-group">
                                    <textarea className="form-control" name="content" value={this.state.commit.content}
                                              placeholder="Source code"
                                              disabled={this.state.loading}
                                              onChange={this.onCommitFieldChange} required/>
                </div>

                <button className="btn btn-large btn-primary" onClick={this.onSubmit} disabled={this.state.loading}>
                    {this.state.loading
                        ? <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                        : "Commit"}
                </button>
            </div>
        )
    }

    onCommitFieldChange(e) {
        this.state.commit[e.target.name] = e.target.value
        this.setState({commit: this.state.commit})
    }

    onSubmit() {
        this.setState({loading: true})
        chrome.runtime.sendMessage({type: SOLUTION_SUBMIT, data: this.state.commit}, (isSuccessful) => {
            console.log(isSuccessful)
            if(isSuccessful) {
                this.setState({showSuccess: true, loading: false})
            } else {
                this.setState({showError: true, loading: false})
            }

        })
    }

    onBackClick() {
        this.setState({showSuccess: false, showError: false})
    }
}
