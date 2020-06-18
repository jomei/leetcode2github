import React, {Component} from "react";

export interface SubmitButtonProps {
    onSubmit: ()=>void
    disabled: boolean
    text: string
}

export class SubmitButton extends Component<SubmitButtonProps, {}> {
    render() {
        return(
            <button className="btn btn-large btn-primary" onClick={this.props.onSubmit} disabled={this.props.disabled}>
                {this.props.disabled
                    ? <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"/>
                    : this.props.text}
            </button>
        )
    }

}
