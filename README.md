# LeetCode2GitHub
![Logo](dist/logo.png?raw=true "Logo")

A simple chrome extension which helps to keep your LeetCode solutions.

## Installation
Just add it to your browser from the [webstore][store]

## Usage
1. Add this extension to your browser
2. Sign in with GitHub
3. Use this extension after LeetCode problem acceptance(this will happen automatically soon)

## Contribution
This extension is build using:
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
