import {AUTH_CALLBACK} from "./messages";
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
chrome.runtime.sendMessage({ type: AUTH_CALLBACK, data: data}, () => {
    try {
        // at the very first callback it throws an error "scripts may close only the windows that were opened by them."
        // and ruin auth process
        // window.close()
    }catch (e) {
        // do nothing
    }
})


