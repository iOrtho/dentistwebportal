import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Layout, Button, Input, Icon, Col, Form } from 'antd';
import firebase, { auth, database } from 'config/firebase';
import UserAction from 'store/actions/user';
import Loading from 'components/LoadingSpinner';

class UpdatePassword extends Component {

	/** The component's constructor */
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.onInputChange = this.onInputChange.bind(this);
		this.handleUpdatePassword = this.handleUpdatePassword.bind(this);
	}

	/**
	 * Return the component's initial state
	 * @return {Object} 
	 */
	getInitialState() {
		return {
			password: '',
			new_password: '',
			loading: false,
			errors: {},
		};
	}

	/**
	 * Submit request to update the password of the agent
	 * @return {Void} 
	 */
    handleUpdatePassword(e) {
    	e.preventDefault();
    	this.setState({loading: true});
		
		const {id, email} = this.props.user;
    	const {password, new_password} = this.state;
    	const cred = firebase.auth.EmailAuthProvider.credential(email, password);
    	
    	auth.currentUser.reauthenticateAndRetrieveDataWithCredential(cred)
    	.then(() => {

    		auth.currentUser.updatePassword(new_password)
    		.then(() => {
	    		this.setState(this.getInitialState());
	    		alert('Your password was successfully updated!');
    		}).catch(err => {
    			this.setState({loading: false, errors: {new_password: err.message}})
    		});
    	})
    	.catch(err => {
    		const errors = {password: 'The password provided is invalid.'};
    		this.setState({loading: false, errors});
    	});
    }

    /**
	 * Update the value of the input and clear the error message
	 * @param  {ChangeEvent} e Input event
	 * @return {Void}   
	 */
	onInputChange(e) {
		const {name, value} = e.target;
		const errors = { ...this.state.errors};
		delete errors[name];

		this.setState({[name]: value, errors});
	}

	/**
	 * Render the component's markup
	 * @return {ReactElement} 
	 */
	render() {
		const {password, new_password, new_password_confirmation, loading, errors} = this.state;

		const style = {
			width: 640,
			margin: '24px auto',
			padding: 24,
			backgroundColor: '#fff',
		};

		return (
			<Layout.Content style={style}>
				<h3>Change my password</h3>
				
				<Col sm={10}>
					<Form className="login-form" onSubmit={this.handleUpdateProfile}>
						<Form.Item
							label="Password"
						    validateStatus={errors.password ? 'error' : ''}
						    help={errors.password}
						>
							<Input
								name="password"
								type="password"
								value={password}
								placeholder="Enter your password password."
								onChange={this.onInputChange}
								required
							/>
						</Form.Item>

						<Form.Item
							label="New password"
						    validateStatus={errors.new_password ? 'error' : ''}
						    help={errors.new_password}
						>
							<Input 
								name="new_password"
								type="password"
								value={new_password}
								placeholder="Enter your new password."
								onChange={this.onInputChange}
								required
							/>
						</Form.Item>

						<Form.Item>
							<Button
								type="primary"
								htmlType="submit" 
								size="large"
								loading={loading}
								onClick={this.handleUpdatePassword}
								style={{width: '100%'}}
							>
								Change password
							</Button>
						</Form.Item>
					</Form>
				</Col>
			</Layout.Content>
		);
	}
}

UpdatePassword.propTypes = {
	user: PropTypes.object.isRequired,
};

export default UpdatePassword;