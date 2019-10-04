import React from 'react';
import { assert } from 'chai';
import { mount } from 'enzyme';
import App from '../src/App.js';

describe('<App />', () => {
  it('renders', () => {
    const wrapper = mount(<App />);

    assert.isDefined(wrapper);
  });
});
