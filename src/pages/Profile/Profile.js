import React, { Component } from 'react';
import { Layout } from 'antd';
import { connect } from 'react-redux';
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
		const {history, user} = this.props;

		const style = { 
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
		};

		return (
			<Layout.Content style={style}>
				<AccountProfile user={user} />
  			</Layout.Content>
		);
	}
}

export default connect(mapStateToProps)(Profile);

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