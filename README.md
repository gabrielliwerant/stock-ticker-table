# AIX Ticker Test

Displays a list of tickers with some retrieved data, some derived data, and displays them hierarchically.

- The ticker data that is displayed can be toggled on/off with switches in the interface.
- The list of tickers to be retrieved can be set via the `tickers` array prop in `src/index.js`

## Running in development

1. `npm i`
1. Set `USE_STUBBED_DATA` to `true` in `src/index.js` if using stubbed data
1. `npm start`

## Running in production

1. Set `USE_STUBBED_DATA` to `false` in `src/index.js`
1. `npm run build`
1. Deploy `dist` folder (contains all main assets)
1. Point to `index.html`

## Testing

1. `npm test`
