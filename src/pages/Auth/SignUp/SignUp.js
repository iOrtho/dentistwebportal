import React, { Component } from 'react';
import { Layout, Icon, Row, Col, Button, Form, Input } from 'antd';
import firebase, { database } from 'config/firebase';
import UserAction from 'store/actions/user';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ErrorsLib from 'lib/Errors';

const companyId = 'ow71aFnAQgLAbQuF9KIQ';
const officeId = 'HfOnKBLWjp3lwT8K6aGe';

const Errors = new ErrorsLib({
	email: 'required',
	firstname: 'required',
	lastname: 'required',
	password: 'required|min:6',
});

class SignUp extends Component {

	/** The component's constructor */
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.createAccount = this.createAccount.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
	}

	/**
	 * Return the component's initial state
	 * @return {Object} 
	 */
	getInitialState() {
		return {
			firstname: '',
			middlename: '',
			lastname: '',
			email: '',
			password: '',
			loading: false,
			errors: {},
		};
	}

	createAccount() {
		const {firstname, middlename, lastname, email, password} = this.state;

		firebase.auth().createUserWithEmailAndPassword(email, password).then(({user}) => {
			const data = {
				email,
				firstname,
				middlename,
				lastname,
				name: `${firstname} ${middlename ? middlename+' ' : '' }${lastname}`,
				photo: '',
				Office: {
					id: officeId,
					name: 'Victron Ortho',
				},
				auth_id: user.uid,
				AuthActivity: [],
				Role: {},
				created_at: new Date(),
				updated_at: new Date(),
			};

			database.collection('Agents').add(data).then((doc) => {
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
	onSubmit(e) {
		this.setState({errors: {}, loading: true});
		e.preventDefault();

		Promise.all([
			Errors.verify(this.state),
			firebase.auth().fetchSignInMethodsForEmail(this.state.email),
			
		])
		.then(data => {
			console.log(data)
			if(data[1].length > 0) {
				const errors = {email: 'This email address is already in use.'};
				this.setState({errors, loading: false});
				return;
			}

			this.createAccount();
		})
		.catch(err => {
			const errors = Array.isArray(err) ? err[0] : err;
			this.setState({errors, loading: false});
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
		const {firstname, middlename, lastname, email, password, loading, errors} = this.state;

		return (
			<Col md={12} offset={6} style={{backgroundColor: '#fff', padding: '1em 5em'}}>
				<Row>
					Already have an account? Just <Link to="/">login here.</Link>
				</Row>
				<Form onSubmit={this.onSubmit}>
					<Form.Item
						label="Email"
					    validateStatus={errors.email ? 'error' : ''}
					    help={errors.email}
					    hasFeedback
					>
						<Input 
							name="email"
							value={email}
							onChange={this.onInputChange}
							placeholder="Enter your email address."
							required 
						/>
					</Form.Item>
					<Form.Item
						label="First name"
					    validateStatus={errors.firstname ? 'error' : ''}
					    help={errors.firstname}
					>
						<Input 
							name="firstname"
							value={firstname}
							onChange={this.onInputChange}
							placeholder="Enter your first name."
							maxLength={25}
							required 
						/>
					</Form.Item>
					<Form.Item
						label="Middle name"
					    validateStatus={errors.middlename ? 'error' : ''}
					    help={errors.middlename}
					>
						<Input 
							name="middlename"
							value={middlename}
							onChange={this.onInputChange}
							placeholder="Or just the initial if you prefer"
							maxLength={25}
						/>
					</Form.Item>
					<Form.Item
						label="Last name"
					    validateStatus={errors.lastname ? 'error' : ''}
					    help={errors.lastname}
					>
						<Input 
							name="lastname"
							value={lastname}
							onChange={this.onInputChange}
							placeholder="Enter your last name."
							maxLength={25}
							required 
						/>
					</Form.Item>
					
					<Form.Item
						label="Password"
					    validateStatus={errors.password ? 'error' : ''}
					    help={errors.password}
					    type="password"
					>
						<Input 
							name="password"
							value={password}
							onChange={this.onInputChange}
							placeholder="Make sure your password is at least 6 characters."
							type="password"
							required 
						/>
					</Form.Item>
					<Form.Item>
						<Button type="primary" loading={loading} onClick={this.onSubmit}>
							Create an Account
						</Button>
					</Form.Item>
				</Form>
			</Col>
		);
	}
}

export default connect(null, mapDispatchToProps)(SignUp);

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