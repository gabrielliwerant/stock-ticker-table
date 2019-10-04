import React, { Component, Fragment } from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Apple from "../stubs/Apple.js";
import Facebook from "../stubs/Facebook.js";
import Tesla from "../stubs/Tesla.js";
import Snapchat from "../stubs/Snapchat.js";
import Google from "../stubs/Google.js";

const STOCK_TICKERS = {
  "Apple": "AAPL",
  "Facebook": "FB",
  "Tesla": "TSLA",
  "Snapchat": "SNAP",
  "Google": "GOOG"
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };
  }

  calculateAverageDailyChange(first, last, numberOfDays) {
    return (first - last) / numberOfDays;
  }

  compareLatestPrice(a, b) {
    if (a["Latest Price"] < b["Latest Price"]) return 1;
    if (a["Latest Price"] > b["Latest Price"]) return -1;
    return 0;
  }

  compareDates(a, b) {
    if (a < b) return 1;
    if (a > b) return -1;
    return 0;
  }

  transformResponseDataToDisplayData(responseData) {
    const original = responseData["Time Series (Daily)"];
    const orderedDates = Object.keys(original).sort((a, b) => this.compareDates(a, b));
    const orderedDatesLen = orderedDates.length;
    const averageDailyChange = this.calculateAverageDailyChange(
      original[orderedDates[0]]["4. close"],
      original[orderedDates[orderedDatesLen - 1]]["4. close"],
      orderedDatesLen
    );

    // KLUDGE: parseFloat might be a problem, as js doesn't handle floats well,
    // and we may end up with rounding errors
    return {
      "Ticker": responseData["Meta Data"]["2. Symbol"],
      "Latest Price": parseFloat(original[orderedDates[0]]["4. close"], 10),
      "Average Daily Change": averageDailyChange.toFixed(2)
    };
  }

  resolveRequest(responseData) {
    const display = this.transformResponseDataToDisplayData(responseData);
    const { data } = this.state;
    const index = data.findIndex(d => d.Ticker === display.Ticker);

    // Non-negative index means we have an existed data set, so we overwrite it.
    // Otherwise, we push a new one.
    if (~index) data[index] = display;
    else data.push(display);

    this.setState({ data });
  }

  componentDidMount() {
    this.resolveRequest(Apple);
    this.resolveRequest(Facebook);
    this.resolveRequest(Tesla);
    this.resolveRequest(Snapchat);
    this.resolveRequest(Google);
  }

  render() {
    const { data } = this.state;

    return (
      <Fragment>
        <Typography variant="h3">AIX Ticker Test</Typography>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ticker</TableCell>
                <TableCell align="right">Latest Price</TableCell>
                <TableCell align="right">Average Daily Change</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                ? data
                    .sort((a, b) => this.compareLatestPrice(a, b))
                    .map(d => (
                      <TableRow key={d.Ticker}>
                        <TableCell>{d.Ticker}</TableCell>
                        <TableCell align="right">{d["Latest Price"]}</TableCell>
                        <TableCell align="right">{d["Average Daily Change"]}</TableCell>
                      </TableRow >
                    ))
                : "Loading"}
              </TableBody>
            </Table>
          </Paper>
      </Fragment>
    );
  }
}

export default App;
