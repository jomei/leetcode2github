import React, {Component} from "react";

interface RepoSelectorProps {
    repos: Array<any>
    selectedRepo: string
    onChange: (e: any) => void
    disabled: boolean
}

export class RepoSelector extends Component<RepoSelectorProps, {}> {
    render() {
        return (
            <select className="custom-select" name="repo" value={this.props.selectedRepo}
                    disabled={this.props.disabled}
                    onChange={this.props.onChange} required>
                <option key="" value="">Choose...</option>
                {this.props.repos.map((value, _) => {
                    return <option key={value.name} value={value.name}>{value.name}</option>
                })}
            </select>
        )
    }
}
