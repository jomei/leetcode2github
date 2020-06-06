import {GitHub, ClientConfig} from "./gh/GitHub";
import {AUTH_START, HANDLE_AUTH_CALLBACK, AUTH_SUCCESS, SOLUTION_SUBMIT, IS_AUTHORIZED} from "./const";

const appConfig = require("./config.json")

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
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    switch (request.event) {
        case IS_AUTHORIZED:
            sendResponse(GitHub.instance().isAuthorized())
            return false
        case AUTH_START:
            startAuth();
            return false
        case HANDLE_AUTH_CALLBACK:
            const authResult = await GitHub.instance().handleCallback(request.data)
            chrome.storage.sync.set({"l2gAuthToken": authResult})
            chrome.runtime.sendMessage({event: AUTH_SUCCESS})
            sendResponse(true)
            return false
        case SOLUTION_SUBMIT:
            GitHub.instance().makeCommit(request.data)
            return true
        case "debug":
            console.log(request)
            break;
        default:
            console.log(`unknown event: ${request.event}`)
            return false;

    }
});

const startAuth = () => {
    chrome.tabs.create({url: GitHub.instance().getLoginURL(), selected: true}, function(data) {
        window.close();
        chrome.tabs.getCurrent(function(tab) {
            chrome.tabs.remove(tab.id, function(){});
        });
    });
}

// Plan:
// + 1. понять как держать приложение авторизованным(и сделать его снова persistent: false
// 1.1 закрывать таб с лендингом, после того как авторизовалось
// + 2. нарисовать формочку если авторизован
// + 3. засабмитить решение
// + 4. подключить ассеты
// + 5. сделать формочку красивой
// + 6. понять про секреты и сложить ключи туда
// + 7. налепить иконку
// 8. сделать нормальный лендинг
// + 9. причесать кодетс
// 10. обработать ошибки авторизации
// + 11. пробовать убрать из скоупа организацию
// + 12. запрашивать owner при auth

