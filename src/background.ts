import {GitHub, ClientConfig, UserData, CommitPayload} from "./gh/GitHub";
import {
    AUTH_START,
    AUTH_CALLBACK,
    AUTH_SUCCESS,
    SOLUTION_SUBMIT,
    GET_USER_DATA,
    LC_SOLUTION_SUBMIT, SETTINGS_SAVE
} from "./messages";
import {generateFileName} from "./generateFileName";

const AUTH_TOKEN_KEY = "l2gAuthToken"
const SOLUTION_KEY = "l2gSolution"
const REPO_KEY = "l2gRepoName"


const appConfig = require("./config.json")

// chrome.storage.sync.remove([AUTH_TOKEN_KEY])

const initGH = (tokenFromStorage) => {
    const config: ClientConfig = {
        clientId: appConfig.clientId,
        clientSecret: appConfig.clientSecret,
        redirectURI: appConfig.redirectURI,
        userToken: appConfig.userToken
    }

    GitHub.initialize(config)

    if(appConfig.userToken != undefined && appConfig.userToken != "") {
        return GitHub.instance().authorizeToken(appConfig.userToken)
    }

    if(tokenFromStorage && tokenFromStorage != "") {
        return GitHub.instance().authorizeToken(tokenFromStorage)
    }
}

chrome.storage.sync.get([AUTH_TOKEN_KEY], (result) => {
    initGH(result[AUTH_TOKEN_KEY])
})

// Listen to messages sent from other parts of the extension.
chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
    switch (message.type) {
        case GET_USER_DATA:
            // GitHub.instance().getUserData().then((data: UserData) => {
            //     chrome.storage.sync.get([SOLUTION_KEY, REPO_KEY], (storageData) => {
            //         let solution = storageData[SOLUTION_KEY]
            //         if(!solution || Object.keys(solution).length == 0) {
            //             solution = {
            //                 title: "",
            //                 lang: "",
            //                 source:""
            //             }
            //         }
            //         sendResponse({userData: data, solution: solution, repo: storageData[REPO_KEY]} )
            //     })
            // })
            GitHub.instance().getUserData().then((data: UserData) => {
                chrome.storage.sync.get(["l2gSettings"], ({l2gSettings: settings}) => {
                    sendResponse({userData: data, settings: settings})
                })
            })

            return true
        case AUTH_START:
            handleAuthStart();
            return false
        case AUTH_CALLBACK:
            GitHub.instance().handleCallback(message.data).then((userToken) => {
                let d = {}
                d[AUTH_TOKEN_KEY] = userToken
                chrome.storage.sync.set(d)
                chrome.runtime.sendMessage({type: AUTH_SUCCESS})
                sendResponse(true)
            })
            return true
        case SOLUTION_SUBMIT:
            GitHub.instance().makeCommit(message.data).then((isSuccessful) => {
                if(isSuccessful) {
                    let repo = {}
                    repo[REPO_KEY] = message.data.repo
                    chrome.storage.sync.set(repo)
                    chrome.storage.sync.remove([SOLUTION_KEY])
                }
                sendResponse(isSuccessful)
            })
            return true
        case LC_SOLUTION_SUBMIT:
            let d = {}
            d[SOLUTION_KEY] = message.data.solution
            chrome.storage.sync.set(d)
            chrome.storage.sync.get(["l2gSettings"], ({l2gSettings: settings}) => {
                if (settings.autoCommitAllowed && message.data.isAccepted) {
                    const cp: CommitPayload = {
                        repo: settings.repo,
                        content: message.data.solution.source,
                        message: message.data.solution.title,
                        fileName: generateFileName(message.data.solution.title, message.data.solution.lang)
                    }
                    GitHub.instance().makeCommit(cp).then((isSuccessful)=>{
                        console.log(isSuccessful)
                    })
                }
            })
            return false
        case SETTINGS_SAVE:
            chrome.storage.sync.set({l2gSettings: message.data}, () => {
                sendResponse(true)
            })
            return true
        default:
            console.log(`unknown type: ${message.type}`)
            return false;
    }
});

function handleAuthStart() {
    chrome.tabs.create({url: GitHub.instance().getLoginURL(), selected: true}, function(data) {
        window.close();
        chrome.tabs.getCurrent(function(tab) {
            chrome.tabs.remove(tab.id, function(){});
        });
    });
}
