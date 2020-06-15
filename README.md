# LeetCode2GitHub
![Logo](dist/logo.png?raw=true "Logo")

A simple chrome extension which helps to keep your LeetCode solutions.

## Installation
Just add it to your browser from the [webstore][store]

## Usage
1. Add this extension to your browser
2. Sign in with GitHub
3. Use this extension after LeetCode problem acceptance(this will happen automatically soon)

## Changelog:
**Version 0.2.0**:
- Added solution form validation
- Added remembering last selected repo and set it as default
- Added loader while the app is initializing
- Added solution file name and commit message generation based on the problem title and selected programming language

**Version 0.1.0**:
- OAuth through GitHub.com
- Simple form for solution submit

## Contribution
This extension is built using:
* TypeScript
* React
* Octokit/rest

### Building
1. Clone this repo
2. `npm i`
3. `cp src/config.json.example src/config.json`
4. Generate [personal token][token] and set it to `config.json` to `userToken` field
5. `npm run dev` to compile once or `npm run watch` to run the dev task in watch mode
6. `npm run build` to build a production (minified) version
7. Visit `chrome://extensions` and load unpacked `dist` directory


[token]: https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line
[store]: https://chrome.google.com/webstore/detail/kbamlgbbijaedbjioeeihphciepmlako
