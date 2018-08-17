import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, Button, Input, Col, Form } from 'antd';
import { database } from 'config/firebase';

class AccountProfile extends Component {

	/** The component's constructor */
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleUpdateProfile = this.handleUpdateProfile.bind(this);
	}

	/**
	 * Return the component's initial state
	 * @return {Object} 
	 */
	getInitialState() {
		return {
			firstname: '',
			lastname: '',
			photo: '',
			loading: false,
		};
	}

	/**
	 * Load the user's information in the form fields
	 */
	componentDidMount() {
		const {firstname, lastname, photo} = this.props.user;
		this.setState({firstname, lastname, photo});
	}

	/**
	 * Submit request to update the database entry of the agent
	 * @return {Void} 
	 */
    handleUpdateProfile(e) {
    	e.preventDefault();
    	this.setState({loading :true});

    	const {id} = this.props.user;
    	const {firstname, lastname} = this.state;
    	const name = `${firstname} ${lastname}`;
    	const Agents = database.collection('Agents');

    	Agents.doc(id).update({firstname, lastname, name}).then(() => {
    		this.setState({loading: false});
    		this.props.onUpdate({firstname, lastname});
    		alert('Your Agent profile was successfully updated!');
    	})
    	.catch(err => {
    		this.setState({loading: false});
    		console.warn(err);
    	});
    }

	/**
	 * Render the component's markup
	 * @return {ReactElement} 
	 */
	render() {
		const {firstname, lastname, loading} = this.state;

		const style = {
			width: 640,
			margin: '24px auto',
			padding: 24,
			backgroundColor: '#fff',
		};

		return (
			<Layout.Content style={style}>
				<p>Your profile is important to us and to the customers.</p>
				<p>It's used to keep track of the agents's activity and is also shown to the customers to provide a more <b>human</b> experience.</p>
				
				<Col sm={10}>
					<Form onSubmit={this.handleUpdateProfile}>
						<Form.Item label="First name">
							<Input 
								value={firstname}
								placeholder="Enter your first name."
								onChange={({target: {value}}) => this.setState({firstname: value})}
								maxLength={25}
								required
							/>
						</Form.Item>

						<Form.Item label="Last name">
							<Input 
								value={lastname}
								placeholder="Enter your last name."
								onChange={({target: {value}}) => this.setState({lastname: value})}
								maxLength={25}
								required
							/>
						</Form.Item>

						<Form.Item>
							<Button
								type="primary"
								htmlType="submit" 
								size="large"
								loading={loading}
								onClick={this.handleUpdateProfile}
								style={{width: '100%'}}
							>
								Save the changes
							</Button>
						</Form.Item>
					</Form>
				</Col>
			</Layout.Content>
		);
	}
}

AccountProfile.propTypes = {
	user: PropTypes.object.isRequired,
	onUpdate: PropTypes.func.isRequired,
};

export default AccountProfile;