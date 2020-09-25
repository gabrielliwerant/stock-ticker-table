import React from "react";
import { assert } from "chai";
import { mount, shallow } from "enzyme";
import { cloneDeep } from "lodash";
import App from "../src/App.js";
import {
  calculateAverageDailyChange,
  compareLatestPrice,
  compareDates,
  transformResponseDataToDisplayData,
  getUpdatedVisibilityData,
  getUpdatedVisibilityDisplayList
} from "../src/App.js";

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

describe("<App />", () => {
  it("renders", () => {
    const wrapper = mount(<App stubMap={STUB_MAP} />);

    assert.isDefined(wrapper);

    wrapper.unmount();
  });

  it("properly calculates average daily change", () => {
    const expectedResult = 1;
    const actualResult = calculateAverageDailyChange(11, 1, 10);

    assert.strictEqual(actualResult, expectedResult);
  });

  it("properly compares latest price", () => {
    let actualResult = compareLatestPrice({ "Latest Price": 1 }, { "Latest Price": 2 });
    assert.strictEqual(actualResult, 1);

    actualResult = compareLatestPrice({ "Latest Price": 2 }, { "Latest Price": 1 });
    assert.strictEqual(actualResult, -1);

    actualResult = compareLatestPrice({ "Latest Price": 1 }, { "Latest Price": 1 });
    assert.strictEqual(actualResult, 0);
  });

  it("properly compares dates", () => {
    let actualResult = compareDates(1, 2);
    assert.strictEqual(actualResult, 1);

    actualResult = compareDates(2, 1);
    assert.strictEqual(actualResult, -1);

    actualResult = compareDates(1, 1);
    assert.strictEqual(actualResult, 0);
  });

  it("properly transforms response data to display data", () => {
    const stubResponseData = {
      "Meta Data": {
        "1. Information": "Daily Prices (open, high, low, close) and Volumes",
        "2. Symbol": "AAPL",
        "3. Last Refreshed": "2019-10-03",
        "4. Output Size": "Compact",
        "5. Time Zone": "US/Eastern"
      },
      "Time Series (Daily)": {
        "2019-10-03": {
            "1. open": "218.4300",
            "2. high": "220.9600",
            "3. low": "215.1320",
            "4. close": "220.8200",
            "5. volume": "26496983"
        },
        "2019-10-02": {
            "1. open": "223.0600",
            "2. high": "223.5800",
            "3. low": "217.9300",
            "4. close": "218.9600",
            "5. volume": "34612300"
        },
      }
    };
    const expectedResult = {
      "Ticker": "AAPL",
      "Latest Price": 220.82,
      "Average Daily Change": "0.93",
      isVisible: true
    };

    const actualResult = transformResponseDataToDisplayData(stubResponseData);
    assert.deepEqual(actualResult, expectedResult);
  });

  it("properly toggles display variable for tickers", () => {
    const dataOn = [{
      "Ticker": "AAPL",
      "Latest Price": 220.82,
      "Average Daily Change": "0.93",
      isVisible: true
    }];
    const expectedDataOff = [{
      "Ticker": "AAPL",
      "Latest Price": 220.82,
      "Average Daily Change": "0.93",
      isVisible: false
    }];
    const displayListOn = [{
      "Ticker": "AAPL",
      isVisible: true
    }];
    const expectedDisplayListOff = [{
      "Ticker": "AAPL",
      isVisible: false
    }];

    // Toggle off
    let actualDataOff = getUpdatedVisibilityData("AAPL", dataOn);
    let actualDisplayListOff = getUpdatedVisibilityDisplayList("AAPL", displayListOn);

    assert.deepEqual(actualDataOff, expectedDataOff);
    assert.deepEqual(actualDisplayListOff, expectedDisplayListOff);

    // Toggle on
    let actualDataOn = getUpdatedVisibilityData("AAPL", actualDataOff);
    let actualDisplayListOn = getUpdatedVisibilityDisplayList("AAPL", actualDisplayListOff);

    assert.deepEqual(actualDataOn, dataOn);
    assert.deepEqual(actualDisplayListOn, displayListOn);
  });
});
