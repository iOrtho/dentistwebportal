import React, { Component } from 'react';
import { Layout, Form, Input, Col, Button } from 'antd';
import { connect } from 'react-redux';
import { database } from 'config/firebase';
import UserAction from 'store/actions/user';
import DoctorForm from 'containers/Settings/DoctorSettingsForm';
import OfficeForm from 'containers/Settings/OfficeSettingsForm';

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
		const {office} = this.props;
		const wrapper = { 
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
		};
		const content = {
			width: 800,
			margin: '24px auto',
			padding: 24,
			backgroundColor: '#fff',
		};

		return (
			<Layout.Content style={wrapper}>
				<Layout.Content style={content}>
					<p>This what your app is all about, keep this information updated.</p>
					<OfficeForm office={office} updateOfficeModel={this.props.updateOfficeModel} />
					<DoctorForm doctor={office.doctors[0]} officeId={office.id} offset={2} />
				</Layout.Content>
  			</Layout.Content>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

/**
 * Map the store's state to the component's props
 * @param  {Object} state.office The office's model 
 * @return {Object}       
 */
function mapStateToProps({office}) {
	return {
		office,
	};
}


/**
 * Map the actions and dispatch of the store to the component's props
 * @param  {Function} dispatch The store's action dispatcher
 * @return {Object}          
 */
function mapDispatchToProps(dispatch) {
	return {
		updateOfficeModel: (data) => dispatch(UserAction.updateOfficeModel(data)),
	};
}