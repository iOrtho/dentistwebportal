import React, { Component } from 'react';
import { Layout, Row } from 'antd';
import { connect } from 'react-redux';
import UserAction from 'store/actions/user';
import AccountProfile from 'containers/Profile/AccountProfile';
import UpdatePassword from 'containers/Profile/UpdatePassword';

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
			padding: '0 50px',
		};

		const colStyle = {
			padding: 24,
			backgroundColor: '#fff',
		};

		return (
			<Layout.Content style={style}>
				<Row type="flex" justify="center" style={{marginTop: '1em'}}> 
					<AccountProfile user={user} onUpdate={setUserModel} style={colStyle} />
					<UpdatePassword user={user} style={colStyle} />
				</Row>
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