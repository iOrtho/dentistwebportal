import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import user from './reducers/user';
import office from './reducers/office';

const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
const reducer = combineReducers({
	user,
	office,
});

export default createStore(reducer, applyMiddleware(thunk), reduxDevTools);