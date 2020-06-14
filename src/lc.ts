import {LC_SOLUTION_SUBMIT} from "./messages";
import {Solution} from "./lc/Solution";

const addListener = () => {
    const submitBtn = document.querySelectorAll('[data-cy="submit-code-btn"]')[0] as HTMLElement

    if(!submitBtn) { return }
    const titleEl = document.querySelectorAll('[data-cy="question-title"]')[0] as HTMLElement
    const langEl = document.querySelectorAll('[data-cy="lang-select"]')[0] as HTMLElement

    submitBtn.addEventListener("click", (e) => {
        const msg : Solution = {
            title: titleEl.innerText,
            lang: langEl.innerText,
            source: ""
        }
        chrome.runtime.sendMessage({type: LC_SOLUTION_SUBMIT, data: msg})
    })
}

const isLoading = (): boolean => {
    const loading = document.getElementById("initial-loading")
    const app = document.getElementById("app") as HTMLElement
    return !!loading || !app
}

const start = () => {
    if(isLoading()) {
        return setTimeout(start, 100)
    }
    addListener()
}

start()
