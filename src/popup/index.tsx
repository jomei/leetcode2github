import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Popup from './Popup';
import {GET_USER_DATA} from "../messages";
import {UserData} from "../gh/GitHub";

chrome.runtime.sendMessage({type: GET_USER_DATA}, ({userData: userData, solution: solution}) => {
    chrome.tabs.query({ active: true, currentWindow: true }, tab => {
        ReactDOM.render(<Popup userData={userData} solution={solution}/>, document.getElementById('popup'));
    });
})



