import {LC_SOLUTION_SUBMIT} from "./messages";
import {Solution} from "./lc/Solution";

function addListener() {
    const submitBtn = document.querySelectorAll('[data-cy="submit-code-btn"]')[0] as HTMLElement

    if (!submitBtn) {
        return
    }
    const titleEl = document.querySelectorAll('[data-cy="question-title"]')[0] as HTMLElement
    const langEl = document.querySelectorAll('[data-cy="lang-select"]')[0] as HTMLElement
    const sourceEl = document.querySelectorAll('[role="presentation"]')[0] as HTMLElement
    submitBtn.addEventListener("click", (e) => {
        const msg = {
            solution: {
                title: titleEl.innerText,
                lang: langEl.innerText,
                source: clearSource(sourceEl.innerText)
            },
            isAccepted: isAccepted()
        }
        chrome.runtime.sendMessage({type: LC_SOLUTION_SUBMIT, data: msg})
    })
}

function isLoading(): boolean {
    const loading = document.getElementById("initial-loading")
    const app = document.getElementById("app") as HTMLElement
    return !!loading || !app
}

function clearSource(rawSource): string {
    const regex = /[0-9]{1,10}\n/g
    return rawSource.replace(regex, "")
}

const STATUS_ACCEPTED = "Accepted"

function isAccepted(): boolean {
    const statusEl = document.querySelectorAll('[data-cy="submissions-content"] .ant-table-row td:nth-child(2)')[0] as HTMLElement
    return statusEl.innerText == STATUS_ACCEPTED
}

const start = () => {
    if (isLoading()) {
        return setTimeout(start, 100)
    }
    addListener()
}

start()

