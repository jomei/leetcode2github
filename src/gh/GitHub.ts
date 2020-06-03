import {Octokit} from "@octokit/rest";

export interface CommitPayload {
    repo: string
    message: string
    content: string
    fileName: string
}

export class GitHub {
    inst: GitHub

    octo: Octokit
    clientId: string
    clientSecret: string
    redirectURI: string

    private constructor(clientId: string, clientSecret: string, redirectURI: string) {
        this.clientId = clientId
        this.clientSecret = clientSecret
        this.redirectURI = redirectURI
    }

    get instance(): GitHub {
        if (!this.inst) {
            throw "Should be initialized first"
        }

        return this.inst
    }

    public initialize(clientId: string, clientSecret: string, redirectURI: string) {
        if (this.inst) {
            return
        }
        this.inst = new GitHub(clientId, clientSecret, redirectURI)
    }


    public isLoggedIn(): boolean {
        return this.octo != null
    }

    public getLoginURL(): string {
        return `https://github.com/login/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectURI}&scope=public_repo&allow_signup=true&state=${this.generateState()}`
    }

    public getRepos() {
        return this.octo.listForAuthenticatedUser()
    }

    public makeCommit(p: CommitPayload) {

    }

    private generateState(): string {
        return "some_random_string"
    }
}
