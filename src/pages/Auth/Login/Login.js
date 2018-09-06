import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import UserAction from 'store/actions/user';
import { Button, Form, Layout, Input, Col, Icon } from 'antd';
import firebase, { database } from 'config/firebase';

class Login extends Component {

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
			email: 'st0mxhack@gmail.com',
			password: 'secret',
		};
	}

	/**
	 * Authenticate the user and load the user data
	 * @param  {SubmitEvent} e event
	 * @return {Void}   
	 */
	handleSubmit(e) {
		e.preventDefault();
		const Agents = database.collection('Agents');

		this.props.form.validateFields((err, val) => {
			if(!err) {
				const {email, password} = val;
				this.setState({loading: true});

				firebase.auth().signInWithEmailAndPassword(email, password)
					.then(({user}) => {
						Agents.where('auth_id', '==', user.uid).get().then(snapshot => {
							let userData = {};
							snapshot.forEach((doc) => userData = {...doc.data(), id: doc.id});

							this.setState({loading: false});
							this.props.setUserModel(userData);
							this.props.history.push('/home');
						});
					})
					.catch(({code, message}) => {
						this.setState({loading: false});
						const errorMsg = 'The password or email provided is incorrect.';
						this.props.form.setFields({
							email: { value: email, errors: [new Error(errorMsg)] },
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
		const {loading, email, password} = this.state;
		const {history} = this.props;

		return (
			<div style={{textAlign: 'center'}}>
				<h1>Welcome to the Alpha Version!</h1>
				<Col md={5} offset={10}>
					<Form className="login-form" onSubmit={this.handleSubmit}>
						<Form.Item>
							{this.props.form.getFieldDecorator('email', {
								initialValue: 'st0mxhack@gmail.com',
								rules: [
									{required: true, whitespace: true, message: 'Please enter an email address.'},
									{type: 'email', message: 'The email entered is not valid.'},
									{max: 50, message: 'The email is too long.'},
									{min: 3, message: 'The email is too short.'},
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
							{this.props.form.getFieldDecorator('password', {
								initialValue: 'secret',
								rules: [{required: true, message: 'Please enter your password.'},],
							})(
								<Input
									type="password"
									prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
									placeholder="Enter your password." 
								/>
							)}
						</Form.Item>

						<Form.Item>
							<Link className="login-form-forgot" to="/forgot" style={{float: 'right'}}>
								Forgot password
								</Link>
					        <Button
					        	type="primary"
					        	htmlType="submit"
					        	className="login-form-button"
					        	style={{width: '100%'}}
					        	loading={loading}
					        >
					        	Log in
					        </Button>
					          Or <Link to="/signup">register now!</Link>
						</Form.Item>
					</Form>
				</Col>
			</div>
		);
	}
}

export default connect(null, mapDispatchToProps)(Form.create()(Login));

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