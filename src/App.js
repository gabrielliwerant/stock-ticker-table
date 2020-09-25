import React, { useState, useEffect, Fragment } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import FormGroup from "@material-ui/core/FormGroup";
import axios from "axios";

import TickerDisplayToggle from './TickerDisplayToggle';
import TickerDataRow from './TickerDataRow';

/**
 * first - most recent day close price
 * last - oldest day close price
 * numberOfDays - total number of days the stock price has been changing
 */
const calculateAverageDailyChange = (first, last, numberOfDays) => {
  return (first - last) / numberOfDays;
};

// Sort prices in descending order (highest first)
const compareLatestPrice = (a, b) => {
  if (a < b) return 1;
  if (a > b) return -1;
  return 0;
};

// Sort dates in descending order (most recent first)
const compareDates = (a, b) => {
  if (a < b) return 1;
  if (a > b) return -1;
  return 0;
};

// Take API response data and return transformed structure
const transformResponseDataToDisplayData = responseData => {
  const original = responseData["Time Series (Daily)"];
  const orderedDates = Object.keys(original).sort((a, b) => compareDates(a, b));
  const orderedDatesLen = orderedDates.length;
  const averageDailyChange = calculateAverageDailyChange(
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
};

// Create new data array, updated with ticker visibility
const getUpdatedVisibilityData = (ticker, data) => {
  let newData;
  const index = data.findIndex(d => d.Ticker === ticker);

  // If indexes exist, toggle the visibility
  if (~index) newData = data.map(d => {
    if (d.Ticker === ticker) return { ...d, isVisible: !d.isVisible };
    return d;
  });

  return newData;
};

// Create new ticker display array, updated with ticker visibility
const getUpdatedVisibilityDisplayList = (ticker, displayList) => {
  let newDisplayList;
  const indexDisplay = displayList.findIndex(d => d.Ticker === ticker);

  // If indexes exist, toggle the visibility
  if (~indexDisplay) newDisplayList = displayList.map(d => {
    if (d.Ticker === ticker) return { ...d, isVisible: !d.isVisible };
    return d;
  });

  return newDisplayList;
};

const App = props => {
  const [data, setData] = useState([]);
  const [displayList, setDisplayList] = useState([]);

  useEffect(() => {
    const { tickers, stubMap } = props;

    if (process.env.USE_STUBBED_DATA === "true") {
      if (tickers && tickers.length) tickers.forEach(ticker => {
        if (stubMap[ticker]) resolveRequest(stubMap[ticker]);
      });
    } else {
      if (tickers && tickers.length) {
        const URI = "https://www.alphavantage.co/query";
        const FUNCTION = "TIME_SERIES_DAILY";

        tickers.forEach(ticker => {
          axios.get(`${URI}?function=${FUNCTION}&symbol=${ticker}&apikey=${process.env.API_KEY}`)
            .then(res => resolveRequest(res.data))
            .catch(err => console.log(err));
        });
      }
    }
  }, [resolveRequest, setData, setDisplayList]);

  const resolveRequest = responseData => {
    const display = transformResponseDataToDisplayData(responseData);
    const index = data.findIndex(d => d.Ticker === display.Ticker);

    // Non-negative index means we have an existing data set, so we overwrite it.
    // Otherwise, we push a new one.
    if (~index) data[index] = display;
    else data.push(display);

    // We use a separate list for display options that won't be affected by
    // sorting of the data, but we only use two of the fields.
    const displayList = data.map(d => ({ Ticker: d.Ticker, isVisible: d.isVisible }));

    setData(data);
    setDisplayList(displayList);
  };

  const handleTickerDisplayToggle = ticker => {
    setData(getUpdatedVisibilityData(ticker, data));
    setDisplayList(getUpdatedVisibilityDisplayList(ticker, displayList));
  };

  return (
    <Fragment>
      <Typography variant="h3">AIX Ticker Test</Typography>
      <FormGroup row>
        {displayList && displayList.map(d =>
          <TickerDisplayToggle
            key={d.Ticker}
            ticker={d.Ticker}
            isVisible={d.isVisible}
            onChange={handleTickerDisplayToggle}
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
                  .sort((a, b) => compareLatestPrice(a["Latest Price"], b["Latest Price"]))
                  .map(d => d.isVisible &&
                    <TickerDataRow
                      key={d.Ticker}
                      ticker={d.Ticker}
                      latestPrice={d["Latest Price"]}
                      averageDailyChange={d["Average Daily Change"]}
                    />
                  )
              : <TableRow><TableCell>"No Data Loaded"</TableCell></TableRow>}
            </TableBody>
          </Table>
        </Paper>
    </Fragment>
  );
}

export default App;
export {
  calculateAverageDailyChange,
  compareLatestPrice,
  compareDates,
  transformResponseDataToDisplayData,
  getUpdatedVisibilityData,
  getUpdatedVisibilityDisplayList
};
