import {HANDLE_AUTH_CALLBACK} from "./const";
import {AuthCallbackData} from "./gh/GitHub";

const parseSearchString = (searchStr): AuthCallbackData => {
    const params = searchStr.substr(1).split("&")
    let parsed = {}
    params.forEach((item) => {
        let split = item.split("=")
        parsed[split[0]] = split[1]
    })

    return {
        code: parsed["code"],
        state: parsed["state"]
    }
}

const data = parseSearchString(window.location.search)
chrome.runtime.sendMessage({ event: HANDLE_AUTH_CALLBACK, data: data}, () => {
    window.close()
})

