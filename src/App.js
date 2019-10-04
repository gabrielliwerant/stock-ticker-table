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
      data: []
    };
  }

  calculateAverageDailyChange(first, last, numberOfDays) {
    return (first - last) / numberOfDays;
  }

  compareLatestPrice(a, b) {
    if (a["Latest Price"] < b["Latest Price"]) return 1;
    if (a["Latest Price"] > b["Latest Price"]) return -1;
    return 0;
  }

  compareDates(a, b) {
    if (a < b) return 1;
    if (a > b) return -1;
    return 0;
  }

  resolveRequest(ticker, responseData) {
    const original = responseData["Time Series (Daily)"];
    const orderedDates = Object.keys(original).sort((a, b) => this.compareDates(a, b));
    const orderedDatesLen = orderedDates.length;
    const averageDailyChange = this.calculateAverageDailyChange(
      original[orderedDates[0]]["4. close"],
      original[orderedDates[orderedDatesLen - 1]]["4. close"],
      orderedDatesLen
    );
    const display = {
      "Ticker": responseData["Meta Data"]["2. Symbol"],
      "Latest Price": parseFloat(original[orderedDates[0]]["4. close"], 10),
      "Average Daily Change": averageDailyChange
    };
    const { data } = this.state;
    const index = data.findIndex(d => d.Ticker === display.Ticker);

    // Non-negative index means we have an existed data set, so we overwrite it.
    // Otherwise, we push a new one.
    if (~index) data[index] = display;
    else data.push(display);

    this.setState({ data });
  }

  componentDidMount() {
    this.resolveRequest(STOCK_TICKERS.Apple, Apple);
    this.resolveRequest(STOCK_TICKERS.Facebook, Facebook);
    this.resolveRequest(STOCK_TICKERS.Tesla, Tesla);
    this.resolveRequest(STOCK_TICKERS.Snapchat, Snapchat);
    this.resolveRequest(STOCK_TICKERS.Google, Google);
  }

  render() {
    const { data } = this.state;

    return (
      <Fragment>
        <h1>AIX Ticker Test</h1>
        {data
          ? (
            <ol>
              {data
                .sort((a, b) => this.compareLatestPrice(a, b))
                .map((d, index) => <li key={index}>{d.Ticker}</li>)}
            </ol>
          )
          : "Loading"}
      </Fragment>
    );
  }
}

export default App;
