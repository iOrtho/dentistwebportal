import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Form, Layout, Input, Col, Icon } from 'antd';
import { auth, database } from 'config/firebase';

class ForgotPassword extends Component {

	/** The component's constructor */
	constructor(props) {
		super(props);

		this.state = this.getInitialState();
		this.sendResetEmail = this.sendResetEmail.bind(this);
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
	 * Send the Firebase auth reset link to the provided email
	 * @param  {String} email The email of the user
	 * @param {String} id The agent's model ID
	 * @return {Void}       
	 */
	sendResetEmail(email, id) {
		const Agents = database.collection('Agents');
		const agentEntry = Agents.doc(id);
		const saveAuthActionAttempt = (success) => {
			const dynamicKeyUpdate = {};
			dynamicKeyUpdate[`AuthActivity.${Date.now()}`] = {
				success,
				type: 'REQUEST_RESET_PWD_LINK',
				created_at: new Date(),
			};
			agentEntry.update(dynamicKeyUpdate);
		};

		auth.sendPasswordResetEmail(email).then(() => {
			alert('The email was successfully sent!');
			this.setState({loading: false});

			saveAuthActionAttempt(true);
		})
		.catch(({code, message}) => {
			this.setState({loading: false});
			console.error({code, message});

			if(code.match('not-found')) {
				this.props.form.setFields({
					email: { value: email, errors: [new Error('We couldn\'t find a user with the email address you entered in our system.')] }
				});
			}

			saveAuthActionAttempt(false);			
		});
	}

	/**
	 * Handle the form validation and verification of the user before sending reset link
	 * @param  {SubmitEvent} e event
	 * @return {Void}   
	 */
	handleSubmit(e) {
		e.preventDefault();

		const Agents = database.collection('Agents');
		const {id} = this.props.office;

		this.props.form.validateFields((err, value) => {
			if(!err) {
				const {email} = value;

				this.setState({loading: true});
				Agents.where('Office.id','==', id).where('email', '==', email).limit(1).get()
				.then(snapshot => {
					let userIsFromThisOffice = false;
					let agentId;
					snapshot.forEach(doc => {
						doc.data().email == email ? userIsFromThisOffice = true : null;
						agentId = doc.id;
					});
					
					if(userIsFromThisOffice) {
						this.sendResetEmail(email, agentId);
						return;
					}

					this.setState({loading: false});
					this.props.form.setFields({
						email: { value: email, errors: [new Error('We couldn\'t find a user with your email in this practice\' system.')] }
					});
				})
				.catch(err => {
					console.error(err);
					this.setState({loading: false});
				});
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
		const style = { textAlign: 'center', display: 'flex', flexDirection: 'column' };

		return (
			<div style={style}>
				<h1>Reset your password</h1>
				<p>Did you forget your password? Just enter your email address below and we will send you a link to your inbox to reset it.</p>
				<Col md={7} style={{alignSelf: 'center'}}>
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
					          Remembered your password? No problem <Link to="/">click here to login!</Link>
						</Form.Item>
					</Form>
				</Col>
			</div>
		);
	}
}

export default connect(mapStateToProps)(Form.create()(ForgotPassword));

/**
 * Map the store's state to the component's props
 * @param  {Object} state.office The practice's Office model 
 * @return {Object}       
 */
function mapStateToProps({office}) {
	return {
		office,
	};
}