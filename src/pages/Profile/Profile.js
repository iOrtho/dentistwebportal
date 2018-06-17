import React, { Component } from 'react';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import UserAction from 'store/actions/user';
import AccountProfile from 'containers/Profile/AccountProfile';

const officeId = 'HfOnKBLWjp3lwT8K6aGe';

class Profile extends Component {

	/** The component's constructor */
	constructor(props) {
		super(props);

		this.state = this.getInitialState();
	}

	/**
	 * Return the component's initial state
	 * @return {Object} 
	 */
	getInitialState() {
		return {
		};
	}

	/**
	 * Render the component's markup
	 * @return {ReactElement} 
	 */
	render() {
		const {user, setUserModel} = this.props;

		const style = { 
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
		};

		return (
			<Layout.Content style={style}>
				<AccountProfile user={user} onUpdate={setUserModel} />
  			</Layout.Content>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

/**
 * Map the store's state to the component's props
 * @param  {Object} state.user The user's Agent model 
 * @return {Object}       
 */
function mapStateToProps({user}) {
	return {
		user,
	};
}


/**
 * Map the actions and dispatch of the store to the component's props
 * @param  {Function} dispatch The store's action dispatcher
 * @return {Object}          
 */
function mapDispatchToProps(dispatch) {
	return {
		setUserModel: (data) => dispatch(UserAction.setUserModel(data)),
	};
}