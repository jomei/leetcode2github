import {GitHub, ClientConfig, UserData} from "./gh/GitHub";
import {
    AUTH_START,
    AUTH_CALLBACK,
    AUTH_SUCCESS,
    SOLUTION_SUBMIT,
    GET_USER_DATA,
    LC_SOLUTION_SUBMIT
} from "./messages";

const appConfig = require("./config.json")

// chrome.storage.sync.remove(["l2gAuthToken"])

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

chrome.storage.sync.get(["l2gAuthToken"], (result) => {
    initGH(result["l2gAuthToken"])
})

// Listen to messages sent from other parts of the extension.
chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
    switch (message.type) {
        case GET_USER_DATA:
            GitHub.instance().getUserData().then((data: UserData) => {
                chrome.storage.sync.get(["l2gSolution"], ({l2gSolution: solution}) => {
                    if(Object.keys(solution).length == 0) {
                        solution = {
                            title: "",
                            lang: "",
                            source:""
                        }
                    }
                    sendResponse({userData: data, solution: solution} )
                })
            })
            return true
        case AUTH_START:
            handleAuthStart();
            return false
        case AUTH_CALLBACK:
            GitHub.instance().handleCallback(message.data).then((userToken) => {
                chrome.storage.sync.set({"l2gAuthToken": userToken})
                chrome.runtime.sendMessage({type: AUTH_SUCCESS})
                sendResponse(true)
            })
            return true
        case SOLUTION_SUBMIT:
            GitHub.instance().makeCommit(message.data).then((isSuccessful) => {
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
