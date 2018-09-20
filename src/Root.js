import bugsnag from 'bugsnag-js';
import bugsnagClient from './lib/bugsnag';
import React from 'react';
import Router from './router';
import { Provider } from 'react-redux';
import store from './store/store';
import createPlugin from 'bugsnag-react';

const ErrorBoundary = bugsnagClient.use(createPlugin(React));
const Root = () => (
    <ErrorBoundary>
        <Provider store={store}> 
            <Router />
        </Provider>
    </ErrorBoundary>
);

export default Root;