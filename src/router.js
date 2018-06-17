import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';
import LoadingSpinner from './components/LoadingSpinner';
import Wrapper from 'containers/DashboardWrapper';
import App from 'containers/App';
import Navbar from 'components/Navbar';
import store from 'store/store';

const loading = () => <LoadingSpinner />;

const LoadableLogin = Loadable({
	loader: () => import('./pages/Auth/Login/index'),
	loading,
});

const LoadableSignUp = Loadable({
	loader: () => import('./pages/Auth/SignUp/index'),
	loading,
});

const LoadableChat = Loadable({
	loader: () => import('./pages/Chat2/index'),
	loading,
});

const LoadableHome = Loadable({
	loader: () => import('./pages/Home/index'),
	loading,
});

const LoadableProfile = Loadable({
	loader: () => import('./pages/Profile/index'),
	loading,
});

const PrivateRoute = ({render: Component, ...others}) => {
	const redirect = (props) => {
		return store.getState().user.id 
			? <Component {...props} /> 
			: <Redirect to={{pathname: '/', from: props.location}} />;
	};

	return <Route {...others} render={redirect} />;
};

const renderDashboardPage = (Component, props) => {
	return (
		<Wrapper {...props}>
			<Component {...props} />
		</Wrapper>
	);
}

const router = () => {
	return (
		<Router>
			<App>
				<Route exact path="/" component={LoadableLogin} />
				<Route path="/signup" component={LoadableSignUp} />
				<PrivateRoute path="/home" render={(props) => renderDashboardPage(LoadableHome, props)} />
				<PrivateRoute path="/profile" render={(props) => renderDashboardPage(LoadableProfile, props)} />
			</App>
		</Router>
	);
};

export default router;