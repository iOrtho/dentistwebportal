import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Input, Icon, Col, Form } from 'antd';
import firebase, { auth, database } from 'config/firebase';
import UserAction from 'store/actions/user';
import Loading from 'components/LoadingSpinner';

class UpdatePassword extends Component {

	/** The component's constructor */
	constructor(props) {
		super(props);

		this.state = this.getInitialState();
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	/**
	 * Return the component's initial state
	 * @return {Object} 
	 */
	getInitialState() {
		return {
			loading: false,
		};
	}

	/**
	 * Submit request to update the password of the agent
	 * @return {Void} 
	 */
    handleSubmit(e) {
    	e.preventDefault();

    	this.props.form.validateFields((err, values) => {
    		if(!err) {
    			this.setState({loading: true});
		
				const {id, email} = this.props.user;
		    	const {password, newpassword} = values;
		    	const cred = firebase.auth.EmailAuthProvider.credential(email, password);
		    	
		    	auth.currentUser.reauthenticateAndRetrieveDataWithCredential(cred)
			    	.then(() => {
			    		auth.currentUser.updatePassword(newpassword)
				    		.then(() => {
				    			const empty = {value: ''};
				    			this.props.form.setFields({password: empty, newpassword: empty});
					    		alert('Your password was successfully updated!');
				    			this.setState({loading: false});
				    		})
				    		.catch(err => {
				    			this.setState({loading: false});
				    			console.error(err);
				    			this.props.form.setFields({
					    			password: {value: newpassword, errors: [new Error('The new password failed to be updated.')] },
					    		});
				    		});
			    	})
			    	.catch(err => {
			    		this.setState({loading: false});
			    		console.error(err);
			    		this.props.form.setFields({
			    			password: {value: password, errors: [new Error('The password provided is invalid.')] },
			    		});
			    	});
    		}
    	});
    	
    }

	/**
	 * Render the component's markup
	 * @return {ReactElement} 
	 */
	render() {
		const {loading, errors} = this.state;

		return (
			<Col sm={8} offset={2} style={{...this.props.style}}>
				<h2>Change my password</h2>
				<p>As a measure of security, changing your password often protects you from security breaches.</p>
				
				<Form onSubmit={this.handleSubmit}>
					<Form.Item label="Current password">
						{this.props.form.getFieldDecorator('password', {
							rules: [
								{required: true, message: 'Please enter your current password.'},
							],
						})(
							<Input type="password" placeholder="Enter your current password." />
						)}
					</Form.Item>

					<Form.Item label="New password">
						{this.props.form.getFieldDecorator('newpassword', {
							rules: [
								{required: true, message: 'Please enter your new password.'},
								{min: 6, message: 'Your new password needs to be at least 6 characters long.'},
							],
						})(
							<Input type="password" placeholder="Enter your new password." />
						)}
					</Form.Item>

					<Form.Item>
						<Button
							type="primary"
							htmlType="submit" 
							size="large"
							loading={loading}
							onClick={this.handleSubmit}
							style={{width: '100%'}}
						>
							Change password
						</Button>
					</Form.Item>
				</Form>
			</Col>
		);
	}
}

UpdatePassword.propTypes = {
	user: PropTypes.object.isRequired,
	style: PropTypes.object,
};

UpdatePassword.defaultProps = {
	style: {},
};

export default Form.create()(UpdatePassword);