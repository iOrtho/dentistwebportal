import React, { Component } from 'react';
import { Layout, Form, Input, Col, Button } from 'antd';
import { database } from 'config/firebase';
import PropTypes from 'prop-types';

class DoctorSettingsForm extends Component {

	/** The component's constructor */
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleUpdate = this.handleUpdate.bind(this);
	}

	/**
	 * Load the doctor's information into the form
	 */
	componentDidMount() {
		const {firstname, middlename, lastname, position, biography} = this.props.doctor;
		this.setState({firstname, middlename, lastname, position, biography});
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
			position: '',
			biography: '',
			loading: false,
			errors: {},
		};
	}

	/**
	 * Handle the updating of the doctor's informations
	 * @param  {SubmitEvent} e Event
	 * @return {Void}   
	 */
	handleUpdate(e) {
		e.preventDefault();

		const Offices = database.collection('Offices');
		const {firstname, middlename, lastname, biography, position} = this.state;

		this.setState({loading: true});
		Offices.doc(this.props.officeId).update({
			doctors: [{firstname, middlename, lastname, position, biography, updated_at: new Date()}],
		})
		.then(() => {
			this.setState({loading: false});
			alert('The doctor data was successfully updated!');
		})
		.catch(err => {
			console.error(err);
			this.setState({loading: false});
			alert('An error occured, please try again.');
		});
	}

	/**
	 * Render the component's markup
	 * @return {ReactElement} 
	 */
	render() {
		const {firstname, middlename, lastname, position, biography, loading, errors} = this.state;
		const {officeId, doctor, ...others} = this.props;
		return (
			<Col sm={10} {...others}>
				<h3>Doctor's information</h3>
				<Form onSubmit={this.handleUpdate}>
					<Form.Item label="Doctor's first name">
						<Input 
							value={firstname}
							placeholder="Enter the principal doctor's first name"
							onChange={({target: {value}}) => this.setState({firstname: value})}
							maxLength={40}
							required
						/>
					</Form.Item>
					<Form.Item label="Doctor's middle name">
						<Input 
							value={middlename}
							placeholder="(Optional) Enter the middle name or initial"
							onChange={({target: {value}}) => this.setState({middlename: value})}
							maxLength={40}
						/>
					</Form.Item>
					<Form.Item label="Doctor's last name">
						<Input 
							value={lastname}
							placeholder="Enter the last name"
							onChange={({target: {value}}) => this.setState({lastname: value})}
							maxLength={40}
							required
						/>
					</Form.Item>
					<Form.Item label="Doctor's biography">
						<Input.TextArea
							value={biography}
							rows={5}
							placeholder="Tell us a little bit more about the doctor behind the practice"
							onChange={({target: {value}}) => this.setState({biography: value})}
							maxLength={300}
							required
						/>
					</Form.Item>

					<Form.Item>
						<Button
							type="primary"
							htmlType="submit" 
							size="large"
							loading={loading}
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

DoctorSettingsForm.propTypes = {
	doctor: PropTypes.object.isRequired,
	officeId: PropTypes.string.isRequired,
};

export default DoctorSettingsForm;