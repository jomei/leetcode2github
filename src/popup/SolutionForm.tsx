import React, {Component} from "react";
import {CommitPayload} from "../gh/GitHub";
import {SOLUTION_SUBMIT} from "../messages";
import {Solution} from "../lc/Solution";
import {RepoSelector} from "./RepoSelector";
import {SubmitButton} from "./SubmitButton";
import {generateFileName} from "../generateFileName";

interface Commit {
    message: string
    content: string
    fileName: string
}

export interface SolutionState {
    commit: Commit
    settings: Settings
    loading: boolean
    showSuccess: boolean
    showError: boolean
    validated: boolean
}

export interface Settings {
    selectedRepo: string
    autoCommitAllowed: boolean
}

export interface SolutionProps {
    repos: Array<any> //todo: set Repo type
    solution: Solution
    settings: Settings
}

export default class SolutionForm extends Component<SolutionProps, SolutionState> {
    constructor(props: SolutionProps) {
        super(props);

        this.onCommitFieldChange = this.onSettingsFieldChange.bind(this)
        this.onSettingsFieldChange = this.onCommitFieldChange.bind(this)
        this.onCheckboxChange = this.onCheckboxChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onBackClick = this.onBackClick.bind(this)
        this.state = {
            commit: {
                message: props.solution.title,
                fileName: generateFileName(props.solution.title, props.solution.lang),
                content: props.solution.source,
            },
            settings: props.settings,
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
                <p className="form-title">Save solution</p>
                <div className={formClass}>
                    <RepoSelector repos={this.props.repos} name="selectedRepo" selectedRepo={this.state.settings.selectedRepo}
                                  onChange={this.onSettingsFieldChange} disabled={this.state.loading}/>
                </div>
                <div className={formClass}>
                    <input type="text" className="form-control" name="fileName"
                           value={this.state.commit.fileName}
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
                                    <textarea className="form-control content-area" name="content"
                                              value={this.state.commit.content}
                                              placeholder="Source code"
                                              disabled={this.state.loading}
                                              onChange={this.onCommitFieldChange} required/>
                </div>

                <div className="form-check">
                    <input className="form-check-input" type="checkbox" checked={this.props.settings.autoCommitAllowed}
                           onChange={this.onCheckboxChange}
                           name="autoCommitAllowed" id="commitAllowed"/>
                    <label className="form-check-label" htmlFor="commitAllowed">
                        Allow autocommit
                    </label>
                    <p className="form-tip">The source code will be committed automatically after the solution
                        acceptance</p>
                </div>

                <SubmitButton onSubmit={this.onSubmit} disabled={this.state.loading} text="Commit"/>
            </div>
        )
    }

    onCommitFieldChange(e) {
        this.state.commit[e.target.name] = e.target.value
        this.setState({commit: this.state.commit})
    }

    onCheckboxChange(e) {
        this.state.settings[e.target.name] = e.target.checked
        this.setState({settings: this.state.settings})
    }

    onSettingsFieldChange(e) {
        this.state.settings[e.target.name] = e.target.value
        this.setState({settings: this.state.settings})
    }

    onSubmit() {
        this.setState({validated: true})
        if (!this.isValid()) {
            return
        }

        this.setState({loading: true})
        chrome.runtime.sendMessage({
            type: SOLUTION_SUBMIT,
            data: {commit: this.getCommitPayload(), settings: this.state.settings}
        }, (isSuccessful) => {
            if (isSuccessful) {
                this.setState({
                    showSuccess: true,
                    loading: false,
                    validated: false,
                    commit: {
                        message: "",
                        fileName: "",
                        content: ""
                    }
                })
            } else {
                this.setState({showError: true, loading: false})
            }

        })
    }

    getCommitPayload(): CommitPayload {
        return {...this.state.commit, repo: this.state.settings.selectedRepo}
    }

    onBackClick() {
        this.setState({showSuccess: false, showError: false})
    }

    isValid(): boolean {
        return this.state.settings.selectedRepo != "" && this.state.commit.fileName != "" &&
            this.state.commit.content != "" && this.state.commit.message != ""
    }
}
