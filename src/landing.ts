const parseSearchString = (searchStr) => {
    const params = searchStr.substr(1).split("&")
    let parsed = {}
    params.forEach((item) => {
        let split = item.split("=")
        parsed[split[0]] = split[1]
    })
    return parsed
}

const parsed = parseSearchString(window.location.search)
chrome.runtime.sendMessage({ event: "loginRedirected", data: {code: parsed["code"]}})


