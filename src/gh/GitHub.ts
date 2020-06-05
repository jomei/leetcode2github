import {Octokit} from "@octokit/rest";
import {createOAuthAppAuth} from "@octokit/auth-oauth-app";

export interface CommitPayload {
    repo: string
    message: string
    content: string
    fileName: string
}

export interface ClientConfig {
    clientId: string
    clientSecret: string
    redirectURI: string
}

export interface AuthCallbackData {
    code: string
    state: string
}

export class GitHub {
    static inst: GitHub

    octo: Octokit

    owner: string
    config: ClientConfig

    private constructor(config: ClientConfig) {
        this.config = config
    }

    static instance(): GitHub {
        if (!this.inst) {
            throw "Should be initialized first"
        }

        return this.inst
    }

    static initialize(config: ClientConfig) {
        if (this.inst) {
            return
        }
        this.inst = new GitHub(config)
    }


    public isAuthorized(): boolean {
        return this.octo != null
    }

    public getLoginURL(): string {
        return `https://github.com/login/oauth/authorize?client_id=${this.config.clientId}&redirect_uri=${this.config.redirectURI}&scope=public_repo&allow_signup=true&state=${this.generateState()}`
    }

    public async getRepos() {
        return this.octo.repos.listForAuthenticatedUser()
    }

    public async authorizeToken(userToken: string) {
        if(this.octo) { return }
        this.octo = new Octokit({auth: userToken})
    }

    public async handleCallback(data: AuthCallbackData) {
        if(this.octo == null) {
            this.octo = new Octokit({
                authStrategy: createOAuthAppAuth,
                auth: {
                    clientId: this.config.clientId,
                    clientSecret: this.config.clientSecret,
                    code: data.code,
                    type: "oauth-app",
                    state: this.generateState(),
                }
            })
            console.log(this.octo)
            console.log(this.octo.auth)
        }
        const authRes = await this.octo.users.getAuthenticated()
        console.log(authRes)
        this.owner = authRes.data.login
        const repos = await this.getRepos()
        console.log(repos)
    }

    public async makeCommit(p: CommitPayload) {
        const curr = await this.getCurrentCommit(p.repo)

        const blob = await this.octo.git.createBlob({
            owner: this.owner,
            repo: p.repo,
            content: p.content,
            encoding: "utf-8"
        })

        const tree = await this.octo.git.createTree({
            owner: this.owner,
            repo: p.repo,
            tree: [{
                path: p.fileName,
                mode: `100644`,
                type: `blob`,
                sha: blob.data.sha,
            }],
            base_tree: curr.treeSha
        })

        const newCommit = await this.octo.git.createCommit({
            owner: this.owner,
            repo: p.repo,
            message: p.message,
            tree: tree.data.sha,
            parents: [curr.commitSha]
        })

        await this.octo.git.updateRef({
            owner: this.owner,
            repo: p.repo,
            ref: 'heads/master',
            sha: newCommit.data.sha
        })
    }

    private generateState(): string {
        return "some_random_string"
    }

    private async getCurrentCommit(repo: string, branch: string = 'master') {
        console.log(this.owner)
        console.log(repo)
        console.log(branch)
        const {data: refData} = await this.octo.git.getRef({
            owner: this.owner,
            repo: repo,
            ref: `heads/${branch}`,
        })
        const commitSha = refData.object.sha
        const {data: commitData} = await this.octo.git.getCommit({
            owner: this.owner,
            repo,
            commit_sha: commitSha,
        })
        return {
            commitSha,
            treeSha: commitData.tree.sha
        }
    }
}
