import React from 'react';
import createPlugin from 'bugsnag-react';
import bugsnag from 'bugsnag-js';
import ReactDOM from 'react-dom';
import Router from './router';
import { Provider } from 'react-redux';
import store from './store/store';
import registerServiceWorker from './registerServiceWorker';

const {REACT_APP_BUGSNAG_KEY: BUGSNAG_KEY} = process.env;
const bugsnagClient = bugsnag(BUGSNAG_KEY);


const ErrorBoundary = bugsnagClient.use(createPlugin(React));
const app = (
    <ErrorBoundary>
        <Provider store={store}> 
            <Router />
        </Provider>
    </ErrorBoundary>
);

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();

bugsnagClient.notify(new Error('Test error'))