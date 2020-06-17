import {GitHub, ClientConfig, UserData} from "./gh/GitHub";
import {
    AUTH_START,
    AUTH_CALLBACK,
    AUTH_SUCCESS,
    SOLUTION_SUBMIT,
    GET_USER_DATA,
    LC_SOLUTION_SUBMIT
} from "./messages";

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
            GitHub.instance().getUserData().then((data: UserData) => {
                chrome.storage.sync.get([SOLUTION_KEY, REPO_KEY], (storageData) => {
                    let solution = storageData[SOLUTION_KEY]
                    if(!solution || Object.keys(solution).length == 0) {
                        solution = {
                            title: "",
                            lang: "",
                            source:""
                        }
                    }
                    sendResponse({userData: data, solution: solution, repo: storageData[REPO_KEY]} )
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
            chrome.storage.sync.set({"l2gSolution": message.data})
            return false
        default:
            console.log(`unknown type: ${message.type}`)
            return false;
    }
});

const handleAuthStart = () => {
    chrome.tabs.create({url: GitHub.instance().getLoginURL(), selected: true}, function(data) {
        window.close();
        chrome.tabs.getCurrent(function(tab) {
            chrome.tabs.remove(tab.id, function(){});
        });
    });
}


// План:
// 0. научиться чекать, что решение принято
// 1. при открытии апп показывать настойки
// 1.2 в настройках выбирается репо, и чекбокс с автокоммитом
// 2. На ассепт
// 2.1 Если автокоммит отключен - показывать заполненную форму как сейчас
// 2.2 Если включен то лоадер и успех или ошибку
// 3. На успех - настройки
// 4. На ошибку - заполненную форму
