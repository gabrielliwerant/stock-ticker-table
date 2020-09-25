import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";

const tickers = ["AAPL", "FB", "TSLA", "SNAP", "GOOG"];

ReactDOM.render(<App tickers={tickers} />, document.getElementById("main"));
