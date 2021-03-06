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
    userToken: string
}

export interface AuthCallbackData {
    code: string
    state: string
}

export interface UserData {
    isAuthorized: boolean,
    repos: Array<any> // todo: set repo type
}

export class GitHub {
    static inst: GitHub

    octo: Octokit

    owner: string
    state: string
    config: ClientConfig

    private constructor(config: ClientConfig) {
        this.config = config
        this.state = this.generateState()
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


    public async getUserData() {
        if(this.octo == null){
            return {
                isAuthorized: false,
                repos: []
            }
        }

        const {data} = await this.getRepos()
        return {
            isAuthorized: true,
            repos: this.filterPersonalRepos(data)
        }
    }

    public getLoginURL(): string {
        return `https://github.com/login/oauth/authorize?client_id=${this.config.clientId}&redirect_uri=${this.config.redirectURI}&scope=public_repo&allow_signup=true&state=${this.generateState()}`
    }

    public async getRepos() {
        return this.octo.repos.listForAuthenticatedUser()
    }

    public async authorizeToken(userToken: string) {
        if(this.octo) { return }
        try {
            this.octo = new Octokit({auth: userToken})
            const authRes = await this.octo.users.getAuthenticated()
            this.owner = authRes.data.login
        } catch (e) {
            this.octo = null
        }
    }

    public async handleCallback(data: AuthCallbackData) {
        if(this.octo == null) {
            if(data.state == this.state) {
                throw "State mismatch"
            }

            const auth = createOAuthAppAuth({
                clientId: this.config.clientId,
                clientSecret: this.config.clientSecret,
            });
            const tokenAuth = await auth({
                type: "token",
                code: data.code,
                state: data.state, // todo: compare it with generated one
            });
            this.octo = new Octokit({auth: tokenAuth["token"]})
            this.config.userToken = tokenAuth["token"]
            const authRes = await this.octo.users.getAuthenticated()
            this.owner = authRes.data.login
        }
        return this.config.userToken
    }

    public async makeCommit(p: CommitPayload) {
        try {
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
            return true
        } catch (e) {
            return false
        }
    }

    private generateState(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }

    private async getCurrentCommit(repo: string, branch: string = 'master') {
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

    private filterPersonalRepos(repos: Array<any>) : Array<any> {
        const owner = this.owner
        return repos.filter((item) => {return item.owner.login == owner})
    }
}
