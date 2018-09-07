import bugsnag from 'bugsnag-js';
import bugsnagClient from './lib/bugsnag';
import React from 'react';
import ReactDOM from 'react-dom';
import Router from './router';
import { Provider } from 'react-redux';
import store from './store/store';
import registerServiceWorker from './registerServiceWorker';
import createPlugin from 'bugsnag-react';

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