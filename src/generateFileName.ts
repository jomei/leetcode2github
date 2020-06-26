export function generateFileName(problemTitle: string, lang: string): string {
    if (problemTitle == "") {
        return ""
    }
    const title = problemTitle.toLowerCase().replace(".", "").replace(" ", "_")
    return `${title}.${getExtensionByLang(lang)}`
}

const LANG_MAP = {
    "python": "py",
    "python3": "py",
    "c++": "cpp",
    "c#": "cs",
    "javascript": "js",
    "ruby": "rb",
    "rust": "rs",
    "typescript": "ts",
    "scala": "sc",
}

function getExtensionByLang(lang: string): string {
    const l = lang.toLowerCase()
    if (l in LANG_MAP) {
        return LANG_MAP[l]
    }
    return l
}
