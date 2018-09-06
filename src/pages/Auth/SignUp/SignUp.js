import React, { Component } from 'react';
import { Layout, Icon, Row, Col, Button, Form, Input } from 'antd';
import { auth, database } from 'config/firebase';
import UserAction from 'store/actions/user';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class SignUp extends Component {

	/** The component's constructor */
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.createAccount = this.createAccount.bind(this);
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
	 * Create a new auth & agent entry for the registering user
	 * @param {Object} fields The form fields
	 * @return {Void} 
	 */
	createAccount(fields) {
		const Agents = database.collection('Agents');
		const {email, password, firstname, middlename, lastname} = fields;
		const {id, name} = this.props.office;

		auth.createUserWithEmailAndPassword(email, password).then(({user}) => {
			const data = {
				email,
				firstname,
				middlename,
				lastname,
				name: `${firstname} ${middlename ? middlename+' ' : '' }${lastname}`,
				Office: { id, name },
				photo: '',
				auth_id: user.uid,
				AuthActivity: [],
				Role: {},
				created_at: new Date(),
				updated_at: new Date(),
			};

			Agents.add(data).then((doc) => {
				this.setState({loading: false});
				this.props.setUserModel({...data, id: doc.id});
				this.props.history.push('/home');
			});
		})
		.catch(err => {
			console.error(err);
			this.setState({loading: false});
		});

	}
	
	/**
	 * Handle the verification of the form field and submits it
	 * @param  {Event} e Submit event
	 * @return {Void}   
	 */
	handleSubmit(e) {
		e.preventDefault();

		this.props.form.validateFields((err, values) => {
			if(!err) {
				const {email} = values;
				
				this.setState({loading: true});
				auth.fetchSignInMethodsForEmail(email)
					.then(data => {
						if(data.length > 0) {
							this.setState({loading: false});
							this.props.form.setFields({
								email: { value: email, errors: [new Error('This email address is already in use.')] },
							});

							return;
						}

						this.createAccount(values);
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

		return (
			<Col md={12} offset={6} style={{backgroundColor: '#fff', padding: '1em 5em'}}>
				<Row>
					Already have an account? Just <Link to="/">login here.</Link>
				</Row>
				<Form onSubmit={this.handleSubmit}>
					<Form.Item label="Email">
						{this.props.form.getFieldDecorator('email', {
							rules: [
								{required: true, whitespace: true, message: 'Please enter your email address.'},
								{type: 'email', message: 'Please enter a valid email.'},
								{max: 50, message: 'Your email is too long.'},
								{min: 3, message: 'Your email is too short.'},
							],
						})(
							<Input placeholder="Enter your email address." maxLength={50} />
						)}
					</Form.Item>
					
					<Form.Item label="First name">
						{this.props.form.getFieldDecorator('firstname', {
							rules: [
								{required: true, whitespace: true, message: 'Please enter your first name.'},
								{max: 30, message: 'Your first name is too long.'},
								{min: 2, message: 'Your first name is too short.'},
							],
						})(
							<Input placeholder="Enter your first name." maxLength={30} />
						)}
					</Form.Item>

					<Form.Item label="Middle name">
						{this.props.form.getFieldDecorator('middlename', {
							initialValue: '',
							rules: [
								{max: 30, message: 'Your middle name is too long.'},
							],
						})(
							<Input 
								placeholder="Or just the initial if you prefer. (Optional)"
								maxLength={30} 
							/>
						)}
					</Form.Item>

					<Form.Item label="Last name">
						{this.props.form.getFieldDecorator('lastname', {
							rules: [
								{required: true, whitespace: true, message: 'Please enter your last name.'},
								{max: 30, message: 'Your last name is too long.'},
								{min: 2, message: 'Your last name is too short.'},
							],
						})(
							<Input placeholder="Please enter your last name." maxLength={30} />
						)}
					</Form.Item>

					<Form.Item label="Password">
						{this.props.form.getFieldDecorator('password', {
							rules: [
								{required: true, whitespace: true, message: 'Please enter your password.'},
								{max: 255, message: 'Your password cannot be more than 255 characters.'},
								{min: 6, message: 'Your password needs to be at least 6 characters.'},
							],
						})(
							<Input 
								type="password"
								placeholder="Make sure your password is at least 6 characters."
								maxLength={255} 
							/>
						)}
					</Form.Item>
					
					<Form.Item>
						<Button type="primary" loading={loading} onClick={this.handleSubmit}>
							Create an Account
						</Button>
					</Form.Item>
				</Form>
			</Col>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(SignUp));

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