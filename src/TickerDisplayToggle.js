/**
 * TickerDisplayToggle
 *
 * Handles the individual ticker toggle switches for managing data display
 */

import React, { Component, Fragment } from "react";
import PropTypes from 'prop-types';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

const TickerDisplayToggle = ({ ticker, isVisible, onChange }) =>
  <FormControlLabel
    control={
      <Switch
        checked={isVisible}
        onChange={() => onChange(ticker)}
        value={ticker}
        color="primary"
      />
    }
    label={ticker}
  />;

TickerDisplayToggle.propTypes = {
  ticker: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};

export default TickerDisplayToggle;
