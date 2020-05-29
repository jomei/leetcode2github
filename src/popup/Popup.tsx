import React, {Component, ReactNode} from "react";
import {Button} from "../kit";
import {Octokit} from "@octokit/rest";
import "./Popup.scss";

interface PopupState {
    showLogin: boolean
}

const ORG_NAME = 'jomei'
const REPO_NAME = 'lc'

export default class Popup extends Component<{}, PopupState> {
    octo: Octokit;

    constructor(p: {}) {
        super(p);
        this.state = {
            showLogin: false
        }
        this.handleTestCommit = this.handleTestCommit.bind(this)
        this.renderBody = this.renderBody.bind(this)
        this.handleLogin = this.handleLogin.bind(this)
        this.octo = new Octokit({auth: ""})
        chrome.runtime.sendMessage({ popupMounted: true, data: this.octo })
    }

    render() {
        return (
            <div className="popupContainer">
                {this.renderBody()}
            </div>
        )
    }

    renderBody(): ReactNode {
        if (this.state.showLogin) {
            return (<div className="form">
                <Button onClick={this.handleLogin} text="login"/>
            </div>)
        }

        return (<Button onClick={this.handleTestCommit} text="TEST Commit"/>)
    }

    handleTestCommit() {
        this.setState({showLogin: true})
    }

    async handleLogin() {
        const data = await this.octo.repos.listForAuthenticatedUser()
        chrome.runtime.sendMessage({ popupMounted: true, data: data })
        const curr = await getCurrentCommit(this.octo, ORG_NAME, REPO_NAME)
        chrome.runtime.sendMessage({ popupMounted: true, data: curr })
    }
}

// const createRepo = async (octo: Octokit, org: string, name: string) => {
//     await octo.repos.createInOrg({org, name, auto_init: true})
// }
//
const getCurrentCommit = async (
    octo: Octokit,
    org: string,
    repo: string,
    branch: string = 'master'
) => {
    const {data: refData} = await octo.git.getRef({
        owner: org,
        repo,
        ref: `heads/${branch}`,
    })
    const commitSha = refData.object.sha
    const {data: commitData} = await octo.git.getCommit({
        owner: org,
        repo,
        commit_sha: commitSha,
    })
    return {
        commitSha,
        treeSha: commitData.tree.sha,
        test: 'hui',
    }
}
//
// const createNewCommit = async (
//     octo: Octokit,
//     org: string,
//     repo: string,
//     message: string,
//     currentTreeSha: string,
//     currentCommitSha: string
// ) =>
//     (await octo.git.createCommit({
//         owner: org,
//         repo,
//         message,
//         tree: currentTreeSha,
//         parents: [currentCommitSha],
//     })).data
//
// const setBranchToCommit = (
//     octo: Octokit,
//     org: string,
//     repo: string,
//     branch: string = `master`,
//     commitSha: string
// ) =>
//     octo.git.updateRef({
//         owner: org,
//         repo,
//         ref: `heads/${branch}`,
//         sha: commitSha,
//     })
//
//
// const createNewTree = async (
//     octo: Octokit,
//     org: string,
//     repo: string,
//     message: string,
//     blob: string, //Base64 string
//     currentCommitSha: string,
//     filePath: string,
//     parentTreeSha: string
// ) => {
//     const tree: Octokit.GitCreateTreeParamsTree = {
//         path: filePath,
//         mode: '100644',
//         type: 'blob',
//         content: blob
//     }
//     const {data} = await octo.git.createTree({
//         owner: org,
//         repo,
//         message,
//         tree: tree,
//         parents: [currentCommitSha],
//     })
//
//     return data
// }
//
