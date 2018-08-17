import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import UserAction from 'store/actions/user';
import { Button, Form, Input, Col, Icon } from 'antd';
import firebase, { database } from 'config/firebase';
import ErrorsLib from 'lib/Errors';

const Errors = new ErrorsLib({
	email: 'required',
	password: 'required',
});

class Login extends Component {

	/** The component's constructor */
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.onSignIn = this.onSignIn.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
	}

	/**
	 * Return the component's initial state
	 * @return {Object} 
	 */
	getInitialState() {
		return {
			isSubmitting: false,
			email: 'st0mxhack@gmail.com',
			password: 'secret',
			errors: {},
		};
	}

	/**
	 * Authenticate the user and load the user data
	 * @param  {SubmitEvent} e event
	 * @return {Void}   
	 */
	onSignIn(e) {
		const Agents = database.collection('Agents');
		const {email, password} = this.state;
		this.setState({isSubmitting: true});
		e.preventDefault();

		Promise.all([
			Errors.verify(this.state),
			firebase.auth().signInWithEmailAndPassword(email, password)
		])
		.then(res => {
			const {uid} = res[1].user;

			Agents.where('auth_id', '==', uid).get().then(snapshot => {
				let userData = {};
				snapshot.forEach((doc) => userData = {...doc.data(), id: doc.id});

				this.setState({isSubmitting: false});
				this.props.setUserModel(userData);
				this.props.history.push('/home');
			});
		})
		.catch(err => {
			console.log(err);
			const errors = Array.isArray(err) ? err[0] : {email: err.message};
			this.setState({errors, isSubmitting: false});
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
		const {isSubmitting, email, password, errors} = this.state;

		return (
			<div style={{textAlign: 'center'}}>
				<h1>Welcome to the Alpha Version!</h1>
				<Col md={5} offset={10}>
					<Form className="login-form" onSubmit={this.onSignIn}>
						<Form.Item
							validateStatus={errors.email ? 'error' : ''}
						    help={errors.email}
						>
							<Input
								name="email"
								prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
								placeholder="Enter your email address." 
								onChange={this.onInputChange}
								value={email}
								required
							/>
						</Form.Item>
						<Form.Item>
							<Input
								name="password"
								prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
								type="password"
								placeholder="Enter your password." 
								onChange={this.onInputChange}
								value={password}
								required
							/>
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
					        	loading={isSubmitting}
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

export default connect(null, mapDispatchToProps)(Login);

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