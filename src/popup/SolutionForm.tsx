import React, {Component} from "react";
import {CommitPayload} from "../gh/GitHub";
import {SOLUTION_SUBMIT} from "../const";

export interface SolutionState {
    commit: CommitPayload
}

//
// export interface SolutionProps {
//     onSubmit()
//     onCancel()
// }

export default class SolutionForm extends Component<{}, SolutionState> {
    constructor(props) {
        super(props);

        this.onFieldChange = this.onFieldChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.state = {
            commit: {
                repo: "",
                fileName: "",
                message: "",
                content: ""
            }
        }
    }

    render() {
        return (
            <div>
                <p>Save solution</p>
                <div className="form-group">
                    <input type="text" className="form-control" name="repo" value={this.state.commit.repo}
                           placeholder="repository"
                           onChange={this.onFieldChange}/>
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" name="fileName" value={this.state.commit.fileName}
                           placeholder="file name"
                           onChange={this.onFieldChange}/>
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" name="message" value={this.state.commit.message}
                           placeholder="message"
                           onChange={this.onFieldChange}/>
                </div>
                <div className="form-group">
                                    <textarea className="form-control" name="content" value={this.state.commit.content}
                                              placeholder="your awesome solution"
                                              onChange={this.onFieldChange}/>
                </div>

                <div className="buttons">
                    <button className="btn btn-large btn-primary" onClick={this.onSubmit}>Submit</button>
                </div>
            </div>
        )
    }

    onFieldChange(e) {
        let state = this.state
        state.commit[e.target.name] = e.target.value
        this.setState(state)
    }

    onSubmit() {
        chrome.runtime.sendMessage({event: SOLUTION_SUBMIT, data: this.state.commit})
    }
}
