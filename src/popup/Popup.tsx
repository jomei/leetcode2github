import React, { Component } from "react";
import {Button} from "./kit";
import {Octokit} from "@octokit/rest";
import "./Popup.scss";

// export default function Popup() {
//   useEffect(() => {
//     // Example of how to send a message to eventPage.ts.
//     chrome.runtime.sendMessage({ popupMounted: true });
//   }, []);
//
//   return <div className="popupContainer">Hello, world!</div>;
// }

export default class Popup extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this)
  }

    render() {
    return(
        <div className="popupContainer">
          <Button onClick={this.handleClick}  text="TEST Login" />
        </div>
    )
  }

  handleClick() {
    let o = new Octokit()
    o.repos
        .listForOrg({
          org: "octokit",
          type: "public",
        })
        .then(({ data }) => {
          console.log(data)
          chrome.runtime.sendMessage({ popupMounted: true, data: data })
        });
  }

}
