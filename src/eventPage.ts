import {Octokit} from "@octokit/rest";
const { createOAuthAppAuth } = require("@octokit/auth-oauth-app");
import GitHub from "./GitHub";

// Listen to messages sent from other parts of the extension.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.event) {
        case "loginStart":
            startLogin();
            break;
        case "loginRedirected":
            handleLoginRedirect(request.data)
            break;
        default:
            console.error(`unknown event: ${request.event}`)

    }
    // onMessage must return "true" if response is async.
    let isResponseAsync = false;

    console.log(request.data)
    const g = new GitHub()
    console.log(g.isLoggedIn())
    return isResponseAsync;
});

const startLogin = () => {
    const clientId = "dabfca31c9be61247266"
    const redirectUri = "http://127.0.0.1:4000/xyz"
    const state = "some_secure_string"
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=public_repo&allow_signup=true&state=${state}`
    chrome.tabs.create({url: url, selected: true}, function(data) {
        window.close();
        chrome.tabs.getCurrent(function(tab) {
            chrome.tabs.remove(tab.id, function(){});
        });
    });
}

// Plan:
// 1. понять как держать приложение авторизованным
// 1.1 закрывать таб с лендингом, после того как авторизовалось
// 2. нарисовать формочку если авторизован
// 3. засабмитить решение
// 4. подключить ассеты
// 5. сделать формочку красивой
// 6. понять про секреты и сложить ключи туда
// 7. налепить иконку
// 8. сделать нормальный лендинг
// 9. причесать кодетс

let octo = null
const handleLoginRedirect = async (data) => {
    if(octo == null) {
        octo = new Octokit({
            authStrategy: createOAuthAppAuth,
            auth: {
                clientId: "dabfca31c9be61247266",
                clientSecret: "",
                code: data.code,
                type: "oauth-app",
                state: "some_secure_string",
            }
        })
    }
    console.log(octo)
    const list = await octo.repos.listForAuthenticatedUser()
    console.log(list)
}
