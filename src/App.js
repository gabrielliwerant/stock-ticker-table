import React, { Component, Fragment } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import FormGroup from "@material-ui/core/FormGroup";
import { cloneDeep } from "lodash";
import axios from "axios";

import TickerDisplayToggle from './TickerDisplayToggle';

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

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      displayList: []
    };

    this.handleTickerDisplayToggle = this.handleTickerDisplayToggle.bind(this);
  }

  /**
   * first - most recent day close price
   * last - oldest day close price
   * numberOfDays - total number of days the stock price has been changing
   */
  calculateAverageDailyChange(first, last, numberOfDays) {
    return (first - last) / numberOfDays;
  }

  // Sort prices in descending order (highest first)
  compareLatestPrice(a, b) {
    if (a["Latest Price"] < b["Latest Price"]) return 1;
    if (a["Latest Price"] > b["Latest Price"]) return -1;
    return 0;
  }

  // Sort dates in descending order (most recent first)
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
      "Average Daily Change": averageDailyChange.toFixed(2),
      isVisible: true
    };
  }

  resolveRequest(responseData) {
    const display = this.transformResponseDataToDisplayData(responseData);
    const { data } = this.state;
    const index = data.findIndex(d => d.Ticker === display.Ticker);

    // Non-negative index means we have an existing data set, so we overwrite it.
    // Otherwise, we push a new one.
    if (~index) data[index] = display;
    else data.push(display);

    // KLUDGE: We clone here so that we can generate a list that won't be affected
    // by sorting of the data, but we only use two of the fields, so we don't
    // need to clone the entire object
    const displayList = cloneDeep(data);

    this.setState({ data, displayList });
  }

  handleTickerDisplayToggle(ticker) {
    const { data, displayList } = this.state;
    const index = data.findIndex(d => d.Ticker === ticker);
    const indexDisplay = displayList.findIndex(d => d.Ticker === ticker);

    // If indexes exist, toggle the visibility
    if (~index) data[index].isVisible = !data[index].isVisible;
    if (~indexDisplay) displayList[indexDisplay].isVisible = !displayList[indexDisplay].isVisible;

    this.setState({ data, displayList });
  }

  componentDidMount() {
    const { USE_STUBBED_DATA, tickers } = this.props;

    if (USE_STUBBED_DATA) {
      if (tickers && tickers.length) tickers.forEach(ticker => {
        if (STUB_MAP[ticker]) this.resolveRequest(STUB_MAP[ticker]);
      });
    } else {
      if (tickers && tickers.length) {
        const URI = "https://www.alphavantage.co/query";
        const FUNCTION = "TIME_SERIES_DAILY";

        // TODO: Hide me in environment variable for production
        const API_KEY = "BIW60Z3KKM36A33Z";

        tickers.forEach(ticker => {
          axios.get(`${URI}?function=${FUNCTION}&symbol=${ticker}&apikey=${API_KEY}`)
            .then(res => this.resolveRequest(res.data))
            .catch(err => console.log(err));
        });
      }
    }
  }

  render() {
    const { data, displayList } = this.state;

    return (
      <Fragment>
        <Typography variant="h3">AIX Ticker Test</Typography>
        <FormGroup row>
          {displayList && displayList.map(d =>
            <TickerDisplayToggle
              key={d.Ticker}
              ticker={d.Ticker}
              isVisible={d.isVisible}
              onChange={this.handleTickerDisplayToggle}
            />
          )}
        </FormGroup>
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
              {data && data.length
                ? data
                    .sort((a, b) => this.compareLatestPrice(a, b))
                    .map(d => d.isVisible && (
                      <TableRow key={d.Ticker}>
                        <TableCell>{d.Ticker}</TableCell>
                        <TableCell align="right">{d["Latest Price"]}</TableCell>
                        <TableCell align="right">{d["Average Daily Change"]}</TableCell>
                      </TableRow >
                    ))
                : <TableRow><TableCell>"No Data Loaded"</TableCell></TableRow>}
              </TableBody>
            </Table>
          </Paper>
      </Fragment>
    );
  }
}

export default App;
