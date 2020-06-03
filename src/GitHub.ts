import {Octokit} from "@octokit/rest";

export default class GitHub {
    octo: Octokit
    clientId: string
    redirectURI: string

    constructor() {
        this.clientId = "SOME VERY SECRET THING"
    }

    public isLoggedIn(): boolean {
        return this.octo != null
    }

    public getLoginURL(): string {
        return `https://github.com/login/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectURI}&scope=public_repo&allow_signup=true&state=${this.generateState()}`
    }

    private generateState(): string {
        return "some_random_string"
    }
}
