import React, { Component, Fragment } from "react";
import Apple from "../stubs/Apple.js";
import Facebook from "../stubs/Facebook.js";
import Tesla from "../stubs/Tesla.js";
import Snapchat from "../stubs/Snapchat.js";
import Google from "../stubs/Google.js";

const STOCK_TICKERS = {
  "Apple": "AAPL",
  "Facebook": "FB",
  "Tesla": "TSLA",
  "Snapchat": "SNAP",
  "Google": "GOOG"
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      [STOCK_TICKERS.Apple]: null,
      [STOCK_TICKERS.Facebook]: null,
      [STOCK_TICKERS.Tesla]: null,
      [STOCK_TICKERS.Snapchat]: null,
      [STOCK_TICKERS.Google]: null
    };
  }

  resolveRequest(ticker, data) {
    this.setState({ [ticker]: data } );
  }

  componentDidMount() {
    this.resolveRequest(STOCK_TICKERS.Apple, Apple);
    this.resolveRequest(STOCK_TICKERS.Facebook, Facebook);
    this.resolveRequest(STOCK_TICKERS.Tesla, Tesla);
    this.resolveRequest(STOCK_TICKERS.Snapchat, Snapchat);
    this.resolveRequest(STOCK_TICKERS.Google, Google);
  }

  render() {
    const { AAPL, FB, TSLA, SNAP, GOOG } = this.state;

    return (
      <Fragment>
        <h1>AIX Ticker Test</h1>
        <div>{AAPL ? AAPL["Meta Data"]["2. Symbol"] : "Loading"}</div>
        <div>{FB ? FB["Meta Data"]["2. Symbol"] : "Loading"}</div>
        <div>{TSLA ? TSLA["Meta Data"]["2. Symbol"] : "Loading"}</div>
        <div>{SNAP ? SNAP["Meta Data"]["2. Symbol"] : "Loading"}</div>
        <div>{GOOG ? GOOG["Meta Data"]["2. Symbol"] : "Loading"}</div>
      </Fragment>
    );
  }
}

export default App;
