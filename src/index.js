import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";

const tickers = ["AAPL", "FB", "TSLA", "SNAP", "GOOG"];

ReactDOM.render(<App USE_STUBBED_DATA={true} tickers={tickers} />, document.getElementById("main"));
