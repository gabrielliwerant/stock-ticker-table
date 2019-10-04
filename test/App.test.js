import React from "react";
import { assert } from "chai";
import { mount } from "enzyme";
import { cloneDeep } from "lodash";
import App from "../src/App.js";

describe("<App />", () => {
  it("renders", () => {
    const wrapper = mount(<App USE_STUBBED_DATA={true} />);

    assert.isDefined(wrapper);

    wrapper.unmount();
  });

  it("properly calculates average daily change", () => {
    const wrapper = mount(<App USE_STUBBED_DATA={true} />);
    const expectedResult = 1;
    const actualResult = wrapper.instance().calculateAverageDailyChange(11, 1, 10);

    assert.strictEqual(actualResult, expectedResult);

    wrapper.unmount();
  });

  it("properly compares latest price", () => {
    const wrapper = mount(<App USE_STUBBED_DATA={true} />);
    const instance = wrapper.instance();

    let actualResult = instance.compareLatestPrice({ "Latest Price": 1 }, { "Latest Price": 2 });
    assert.strictEqual(actualResult, 1);

    actualResult = instance.compareLatestPrice({ "Latest Price": 2 }, { "Latest Price": 1 });
    assert.strictEqual(actualResult, -1);

    actualResult = instance.compareLatestPrice({ "Latest Price": 1 }, { "Latest Price": 1 });
    assert.strictEqual(actualResult, 0);

    wrapper.unmount();
  });

  it("properly compares dates", () => {
    const wrapper = mount(<App USE_STUBBED_DATA={true} />);
    const instance = wrapper.instance();

    let actualResult = instance.compareDates(1, 2);
    assert.strictEqual(actualResult, 1);

    actualResult = instance.compareDates(2, 1);
    assert.strictEqual(actualResult, -1);

    actualResult = instance.compareDates(1, 1);
    assert.strictEqual(actualResult, 0);

    wrapper.unmount();
  });

  it("properly transforms response data to display data", () => {
    const wrapper = mount(<App USE_STUBBED_DATA={true} />);
    const instance = wrapper.instance();
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

    const actualResult = instance.transformResponseDataToDisplayData(stubResponseData);
    assert.deepEqual(actualResult, expectedResult);

    wrapper.unmount();
  });

  it("properly toggles display variable for tickers", () => {
    const wrapper = mount(<App USE_STUBBED_DATA={true} />);
    const instance = wrapper.instance();
    const stub = [{
      "Ticker": "AAPL",
      "Latest Price": 220.82,
      "Average Daily Change": "0.93",
      isVisible: true
    }];

    wrapper.setState({
      data: stub,
      displayList: cloneDeep(stub)
    });

    // Should toggle off
    instance.handleTickerDisplayToggle("AAPL");

    let actualResultData = wrapper.state().data[0].isVisible;
    let actualResultSisplayList = wrapper.state().displayList[0].isVisible;

    assert.strictEqual(actualResultData, false);
    assert.strictEqual(actualResultSisplayList, false);

    // Should toggle back on
    instance.handleTickerDisplayToggle("AAPL");

    actualResultData = wrapper.state().data[0].isVisible;
    actualResultSisplayList = wrapper.state().displayList[0].isVisible;

    assert.strictEqual(actualResultData, true);
    assert.strictEqual(actualResultSisplayList, true);

    wrapper.unmount();
  });
});
