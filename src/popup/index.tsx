import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Popup from './Popup';
import {IS_AUTHORIZED} from "../messages";

chrome.runtime.sendMessage({type: IS_AUTHORIZED}, (isAuthorized) => {
    chrome.tabs.query({ active: true, currentWindow: true }, tab => {
        ReactDOM.render(<Popup isAuthorized={isAuthorized}/>, document.getElementById('popup'));
    });
})



