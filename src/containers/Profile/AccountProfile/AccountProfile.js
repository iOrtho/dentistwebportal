import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Icon, Col, Form } from 'antd';
import { database } from 'config/firebase';
import Loading from 'components/LoadingSpinner';

class AccountProfile extends Component {

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
			photo: '',
			loading: false,
		};
	}

	/**
	 * Load the user's information in the form fields
	 */
	componentDidMount() {
		this.setState({photo: this.props.user.photo});
	}

	/**
	 * Submit request to update the database entry of the agent
	 * @return {Void} 
	 */
    handleSubmit(e) {
    	e.preventDefault();
		const Agents = database.collection('Agents');
		const {id} = this.props.user;

    	this.props.form.validateFields((err, values) => {
    		if(!err) {
		    	const {firstname, middlename, lastname} = values;
		    	const name = `${firstname} ${middlename ? middlename+' ' : '' }${lastname}`;

    			this.setState({loading: true});
		    	Agents.doc(id).update({firstname, lastname, name})
			    	.then(() => {
			    		this.setState({loading: false});
			    		this.props.onUpdate({firstname, lastname, name});
			    		alert('Your Agent profile was successfully updated!');
			    	})
			    	.catch(err => {
			    		this.setState({loading: false});
			    		console.error(err);
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
		const {firstname, lastname} = this.props.user;

		return (
			<Col sm={8} style={{...this.props.style}}>
				<h2>Update my profile</h2>
				<p>Your profile is important to us and to the customers.</p>
				<p>It's used to keep track of the app's activity and also to provide a more <b>human</b> experience.</p>
				
				<Form onSubmit={this.handleSubmit}>
					<Form.Item label="First name">
						{this.props.form.getFieldDecorator('firstname', {
							initialValue: firstname,
							rules: [
								{required: true, whitespace: true, message: 'Please enter your first name'},
								{max: 30, message: 'The first name you entered is too long.'},
								{min: 2, message: 'The first name you entered is too short.'},
							],
						})(
							<Input placeholder="Enter your first name." maxLength={30} />
						)}
					</Form.Item>

					<Form.Item label="Middle name">
						{this.props.form.getFieldDecorator('middlename', {
							initialValue: '',
							rules: [
								{max: 30, message: 'The middle name you entered is too long.'},
							],
						})(
							<Input placeholder="Or your initial if you prefer. (Optional)" maxLength={30} />
						)}
					</Form.Item>

					<Form.Item label="Last name">
						{this.props.form.getFieldDecorator('lastname', {
							initialValue: lastname,
							rules: [
								{required: true, whitespace: true, message: 'Please enter your last name'},
								{max: 30, message: 'The last name you entered is too long.'},
								{min: 2, message: 'The last name you entered is too short.'},
							],
						})(
							<Input placeholder="Enter your first name." maxLength={30} />
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
							Save the changes
						</Button>
					</Form.Item>
				</Form>
			</Col>
		);
	}
}

AccountProfile.propTypes = {
	user: PropTypes.object.isRequired,
	onUpdate: PropTypes.func.isRequired,
	style: PropTypes.object,
};

AccountProfile.defaultProps = {
	style: {},
};

export default Form.create()(AccountProfile);