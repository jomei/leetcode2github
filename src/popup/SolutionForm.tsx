import React, {Component} from "react";

export interface SolutionState {
    repo: string,
    fileName: string,
    solution: string
}

export interface SolutionProps {
    onSubmit()
    onCancel()
}

export class SolutionForm extends Component<SolutionProps, SolutionState> {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="solution-container">
                <div className="fields">
                    <input type="text" placeholder="repository"/>
                    <input type="text" placeholder="file name"/>
                    <input type="textarea" placeholder="your awesome solution"/>
                </div>
                <div className="buttons">
                    <button className="btn" onClick={this.props.onCancel}>Cancel</button>
                    <button className="btn" onClick={this.props.onSubmit}>Submit</button>
                </div>
            </div>
        )
    }
}
