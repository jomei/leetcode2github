import {GitHub, ClientConfig, UserData} from "./gh/GitHub";
import {AUTH_START, AUTH_CALLBACK, AUTH_SUCCESS, SOLUTION_SUBMIT, GET_USER_DATA} from "./messages";

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
chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
    switch (message.type) {
        case GET_USER_DATA:
            GitHub.instance().getUserData().then((data: UserData) => {
                sendResponse(data)
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
            GitHub.instance().makeCommit(message.data).then((e) => {
                sendResponse(true)
            })
            return true
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
// 10.1 обработать ошибки коммита
// + 11. пробовать убрать из скоупа организацию
// + 12. запрашивать owner при auth
// + 13. экран успешного коммита
