/**
 * TableDataRow
 *
 * Handles display of individual rows of ticker data for table
 */

import React, { Component, Fragment } from "react";
import PropTypes from 'prop-types';
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

const TickerDataRow = ({ ticker, latestPrice, averageDailyChange }) =>
  <TableRow>
    <TableCell>{ticker}</TableCell>
    <TableCell align="right">{latestPrice}</TableCell>
    <TableCell align="right">{averageDailyChange}</TableCell>
  </TableRow >;

TickerDataRow.propTypes = {
  ticker: PropTypes.string.isRequired,
  latestPrice: PropTypes.number.isRequired,
  averageDailyChange: PropTypes.string.isRequired
};

export default TickerDataRow;
