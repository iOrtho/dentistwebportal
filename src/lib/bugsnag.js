import bugsnag from 'bugsnag-js';

const {REACT_APP_BUGSNAG_KEY: BUGSNAG_KEY} = process.env;
export default bugsnag(BUGSNAG_KEY);