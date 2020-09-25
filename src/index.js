import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";

import Apple from "../stubs/Apple.js";
import Facebook from "../stubs/Facebook.js";
import Tesla from "../stubs/Tesla.js";
import Snapchat from "../stubs/Snapchat.js";
import Google from "../stubs/Google.js";

const STUB_MAP = {
  "AAPL": Apple,
  "FB": Facebook,
  "TSLA": Tesla,
  "SNAP": Snapchat,
  "GOOG": Google
};

ReactDOM.render(<App stubMap={STUB_MAP} />, document.getElementById("main"));
