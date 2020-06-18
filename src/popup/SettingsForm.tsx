import React, {Component} from "react";
import {RepoSelector} from "./RepoSelector";
import {SubmitButton} from "./SubmitButton";

export interface Settings {
    repo: string
    autoCommitAllowed: boolean
}

export interface SettingsFormProps {
    settings: Settings
    repos: Array<any>
}

interface SettingsFormState extends Settings {
    loading: boolean
}

export class SettingsForm extends Component<SettingsFormProps, SettingsFormState> {
    constructor(props: SettingsFormProps) {
        super(props);
        this.onFieldChange = this.onFieldChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.state = {...props.settings, loading: false}
    }

    render() {
        return (
            <div className="settings-form">
                <p>Settings</p>
                <div className="form-group">
                    <RepoSelector repos={this.props.repos} selectedRepo={this.state.repo}
                                  onChange={this.onFieldChange} disabled={this.state.loading}/>
                </div>
                <div className="form-check">
                    <input className="form-check-input"  type="checkbox" checked={this.state.autoCommitAllowed}
                           onChange={this.onFieldChange}
                           name="autoCommitAllowed" id="commitAllowed"/>
                    <label className="form-check-label" htmlFor="commitAllowed">
                        Allow autocommit
                    </label>
                </div>

                <SubmitButton onSubmit={this.onSubmit} disabled={this.state.loading} text="Save"/>
            </div>
        )
    }

    onFieldChange(e) {
        this.state[e.target.name] = e.target.value
        this.setState(this.state)
    }

    onSubmit() {

    }
}
