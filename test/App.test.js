import React from 'react';
import { assert } from 'chai';
import { mount } from 'enzyme';
import App from '../src/App.js';

describe('<App />', () => {
  it('renders', () => {
    const wrapper = mount(<App />);

    assert.isDefined(wrapper);

    wrapper.unmount();
  });

  it('properly calculates average daily change', () => {
    const wrapper = mount(<App />);
    const expectedResult = 1;
    const actualResult = wrapper.instance().calculateAverageDailyChange(11, 1, 10);

    assert.strictEqual(expectedResult, actualResult);

    wrapper.unmount();
  });

  it('properly compares latest price', () => {
    const wrapper = mount(<App />);
    const instance = wrapper.instance();

    let actualResult = instance.compareLatestPrice({ "Latest Price": 1 }, { "Latest Price": 2 });
    assert.strictEqual(1, actualResult);

    actualResult = instance.compareLatestPrice({ "Latest Price": 2 }, { "Latest Price": 1 });
    assert.strictEqual(-1, actualResult);

    actualResult = instance.compareLatestPrice({ "Latest Price": 1 }, { "Latest Price": 1 });
    assert.strictEqual(0, actualResult);

    wrapper.unmount();
  });

  it('properly compares dates', () => {
    const wrapper = mount(<App />);
    const instance = wrapper.instance();

    let actualResult = instance.compareDates(1, 2);
    assert.strictEqual(1, actualResult);

    actualResult = instance.compareDates(2, 1);
    assert.strictEqual(-1, actualResult);

    actualResult = instance.compareDates(1, 1);
    assert.strictEqual(0, actualResult);

    wrapper.unmount();
  });
});
