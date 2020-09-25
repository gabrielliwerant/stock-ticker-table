# Stock Ticker Table

Displays a list of tickers with some retrieved data, some derived data, and displays them hierarchically.

- The ticker data that is displayed can be toggled on/off with switches in the interface.
- The list of tickers to be retrieved can be set via the `TICKERS` array in `src/App.js`

NOTE: Repo uses a `.env` file which should be untracked, but remains tracked for now for demonstration purposes.

## Running in development

1. `npm i`
1. Set `USE_STUBBED_DATA` to `true` in `.env` if using stubbed data
1. `npm start`

## Running in production

1. Set `USE_STUBBED_DATA` to `false` in `.env`
1. `npm run build`
1. Deploy `dist` folder (contains all main assets)
1. Point to `index.html`

## Testing

1. `npm test`
