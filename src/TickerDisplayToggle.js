import React, { Component, Fragment } from "react";
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

export default TickerDisplayToggle;
