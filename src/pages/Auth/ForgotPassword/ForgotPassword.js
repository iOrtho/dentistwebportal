import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Layout, Input, Col, Icon } from 'antd';
import { auth, database } from 'config/firebase';

class ForgotPassword extends Component {

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
	 * Send the reset link to the user's email address
	 * @param  {SubmitEvent} e event
	 * @return {Void}   
	 */
	handleSubmit(e) {
		e.preventDefault();

		const Agents = database.collection('Agents');
		const {email} = this.state;

		this.props.form.validateFields((err, value) => {
			if(!err) {
				const {email} = value;

				Agents.where('email', '==', email).limit(1).get()
					.then(() => {
						// stuff..
					})
					.catch(console.error);
			}
		});
		
	}

	/**
	 * Render the component's markup
	 * @return {ReactElement} 
	 */
	render() {
		const {loading} = this.state;
		const {history} = this.props;

		return (
			<div style={{textAlign: 'center'}}>
				<h1>Reset your password</h1>
				<p>Did you forget your password? Just enter your email address below and we will send you a link to your inbox to reset it.</p>
				<Col md={5} offset={10}>
					<Form onSubmit={this.handleSubmit}>
						<Form.Item>
							{this.props.form.getFieldDecorator('email', {
								initialValue: 'st0mxhack@gmail.com',
								rules: [
									{required: true, whitespace: true, message: 'Please enter your email address.'},
									{type: 'email', message: 'The email you entered is not valid.'},
									{max: 50, message: 'The email entered is too long.'},
									{min: 3, message: 'The email entered is too short.'},
								],
							})(
								<Input
									prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
									placeholder="Enter your email address." 
									maxLength={50}
								/>
							)}	
						</Form.Item>

						<Form.Item>
					        <Button
					        	type="primary"
					        	htmlType="submit"
					        	style={{width: '100%'}}
					        	loading={loading}
					        >
					        	Send reset password link
					        </Button>
					          Remembered your password? No problem <Link to="/login">click here to login!</Link>
						</Form.Item>
					</Form>
				</Col>
			</div>
		);
	}
}

export default Form.create()(ForgotPassword);