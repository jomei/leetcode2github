import React, {Component, ReactNode} from "react";
import {Button} from "../kit";
import {Octokit} from "@octokit/rest";
import {SolutionForm} from "./SolutionForm";
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
        this.handleLogin = this.handleLogin.bind(this)
        this.octo = new Octokit({auth: "e2400c83b640fb6aee2d34fed9d5b27df8dbb021"})
        chrome.runtime.sendMessage({ popupMounted: true, data: this.octo })
    }

    render() {
        return (
            <div className="popupContainer">
               <SolutionForm onCancel={this.handleTestCommit} onSubmit={this.handleLogin}/>
            </div>
        )
    }

    handleTestCommit() {
        this.setState({showLogin: true})
    }

    async handleLogin() {
        const data = await this.octo.repos.listForAuthenticatedUser()
        chrome.runtime.sendMessage({ popupMounted: true, data: data })
        const curr = await getCurrentCommit(this.octo, ORG_NAME, REPO_NAME)
        chrome.runtime.sendMessage({ popupMounted: true, data: curr })
        const blob = await this.octo.git.createBlob({
            owner: ORG_NAME,
            repo: REPO_NAME,
            content: "some_test_content",
            encoding: "utf-8"
        })
        chrome.runtime.sendMessage({ popupMounted: true, data: blob })
        const tree = await this.octo.git.createTree({
            owner: ORG_NAME,
            repo: REPO_NAME,
            tree: [{
                path: 'test.txt',
                mode: `100644`,
                type: `blob`,
                sha: blob.data.sha,
            }],
            base_tree: curr.treeSha
        })
        chrome.runtime.sendMessage({ popupMounted: true, data: tree })

        const newCommit = await this.octo.git.createCommit({
            owner: ORG_NAME,
            repo: REPO_NAME,
            message: "My test commit",
            tree: tree.data.sha,
            parents: [curr.commitSha]
        })
        chrome.runtime.sendMessage({ popupMounted: true, data: newCommit })
        const setResult = await this.octo.git.updateRef({
            owner: ORG_NAME,
            repo: REPO_NAME,
            ref: 'heads/master',
            sha: newCommit.data.sha
        })
        chrome.runtime.sendMessage({ popupMounted: true, data: setResult })
    }
}

// const createRepo = async (octo: Octokit, org: string, name: string) => {
//     await octo.repos.createInOrg({org, name, auto_init: true})
// }
//
const getCurrentCommit = async (octo: Octokit, org: string, repo: string, branch: string = 'master') => {
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
        treeSha: commitData.tree.sha
    }
}
