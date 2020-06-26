import React, {Component} from "react";
import {CommitPayload} from "../gh/GitHub";
import {SOLUTION_SUBMIT} from "../messages";
import {Solution} from "../lc/Solution";
import {RepoSelector} from "./RepoSelector";
import {SubmitButton} from "./SubmitButton";
import {generateFileName} from "../generateFileName";


export interface SolutionState {
    commit: CommitPayload
    loading: boolean
    showSuccess: boolean
    showError: boolean
    validated: boolean
}

export interface SolutionProps {
    repos: Array<any> //todo: set Repo type
    solution: Solution
    selectedRepo: string
}

export default class SolutionForm extends Component<SolutionProps, SolutionState> {
    constructor(props: SolutionProps) {
        super(props);

        this.onCommitFieldChange = this.onCommitFieldChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onBackClick = this.onBackClick.bind(this)
        this.state = {
            commit: {
                repo: props.selectedRepo,
                fileName: generateFileName(props.solution.title, props.solution.lang),
                message: props.solution.title,
                content: props.solution.source
            },
            loading: false,
            showSuccess: false,
            showError: false,
            validated: false
        }
    }

    render() {
        if (this.state.showError) {
            return (
                <div className="text-center">
                    <p>Solution commit failed =(</p>
                    <button className="btn btn-large btn-primary" onClick={this.onBackClick}>Try again</button>
                </div>
            )
        }

        if (this.state.showSuccess) {
            return (
                <div className="text-center">
                    <p>Solution committed successfully!</p>
                    <button className="btn btn-large btn-success" onClick={this.onBackClick}>Nice!</button>
                </div>
            )
        }
        let formClass = "form-group"
        if (this.state.validated) {
            formClass += " was-validated"
        }
        return (
            <div>
                <p>Save solution</p>
                <div className={formClass}>
                    <RepoSelector repos={this.props.repos} selectedRepo={this.props.selectedRepo}
                                  onChange={this.onCommitFieldChange} disabled={this.state.loading}/>
                </div>
                <div className={formClass}>
                    <input type="text" className="form-control" name="fileName" value={this.state.commit.fileName}
                           placeholder="File name"
                           disabled={this.state.loading}
                           onChange={this.onCommitFieldChange} required/>
                </div>
                <div className={formClass}>
                    <input type="text" className="form-control" name="message" value={this.state.commit.message}
                           placeholder="Message"
                           disabled={this.state.loading}
                           onChange={this.onCommitFieldChange} required/>
                </div>
                <div className={formClass}>
                                    <textarea className="form-control" name="content" value={this.state.commit.content}
                                              placeholder="Source code"
                                              disabled={this.state.loading}
                                              onChange={this.onCommitFieldChange} required/>
                </div>

                <SubmitButton onSubmit={this.onSubmit} disabled={this.state.loading} text="Commit"/>
            </div>
        )
    }

    onCommitFieldChange(e) {
        this.state.commit[e.target.name] = e.target.value
        this.setState({commit: this.state.commit})
    }

    onSubmit() {
        this.setState({validated: true})
        if (!this.isValid()) {
            return
        }

        this.setState({loading: true})
        chrome.runtime.sendMessage({type: SOLUTION_SUBMIT, data: this.state.commit}, (isSuccessful) => {
            if (isSuccessful) {
                this.setState({
                    showSuccess: true,
                    loading: false,
                    validated: false,
                    commit: {
                        message: "",
                        fileName: "",
                        content: "",
                        repo: this.state.commit.repo
                    }
                })
            } else {
                this.setState({showError: true, loading: false})
            }

        })
    }

    onBackClick() {
        this.setState({showSuccess: false, showError: false})
    }

    isValid(): boolean {
        return this.state.commit.repo != "" && this.state.commit.fileName != "" &&
            this.state.commit.content != "" && this.state.commit.message != ""
    }
}
