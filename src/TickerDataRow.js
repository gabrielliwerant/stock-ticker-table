/**
 * TableDataRow
 *
 * Handles display of individual rows of ticker data for table
 */

import React, { Component, Fragment } from "react";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

const TickerDataRow = ({ ticker, latestPrice, averageDailyChange }) =>
  <TableRow>
    <TableCell>{ticker}</TableCell>
    <TableCell align="right">{latestPrice}</TableCell>
    <TableCell align="right">{averageDailyChange}</TableCell>
  </TableRow >;

export default TickerDataRow;
