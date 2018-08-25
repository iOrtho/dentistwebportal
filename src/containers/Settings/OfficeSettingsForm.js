import React, { Component } from 'react';
import { Layout, Form, Input, Col, Button } from 'antd';
import { database } from 'config/firebase';
import UserAction from 'store/actions/user';
import PropTypes from 'prop-types';

class OfficeSettingsForm extends Component {

	/** The component's constructor */
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleUpdate = this.handleUpdate.bind(this);
		this.fetchRelatedIds = this.fetchRelatedIds.bind(this);
	}

	/**
	 * Return the component's initial state
	 * @return {Object} 
	 */
	getInitialState() {
		return {
			name: '',
			description: '',
			locations: [],
			loading: false,
			errors: {},
		};
	}

	/**
	 * Load the office's information into the form
	 */
	componentDidMount() {
		const {name, description, locations} = this.props.office;
		this.setState({name, description, locations});
	}

	/**
	 * Get the IDs of all the documents that will need updating
	 * @param  {Function} cb The callback function
	 * @return {Void}      
	 */
	fetchRelatedIds(cb) {
		const {id} = this.props.office;
		const Agents = database.collection('Agents');
		const Messages = database.collection('Messages');
		const agentsId = [];
		const msgsId = [];

		Promise.all([
			Agents.where('Office.id','==', id).get(),
			Messages.where('Author.Office.id','==', id).get(),
		]).then(data => {
			const agents = data[0];
			const msgs = data[1];

			agents.docChanges().forEach(changes => {
				if(!agentsId.includes(changes.doc.id)) {
					agentsId.push(changes.doc.id);
				}
			});

			msgs.docChanges().forEach(changes => {
				if(!msgsId.includes(changes.doc.id)) {
					msgsId.push(changes.doc.id);
				}
			});

			cb(null, {agents: agentsId, messages: msgsId});
		}).catch(err => {
			console.warn(err);
			cb(err);
		});
	}

	/**
	 * Update the relevant database entries
	 * @param  {SubmitEvent} e Submit event
	 * @return {Void}   
	 */
	handleUpdate(e) {
		e.preventDefault();

		const Offices = database.collection('Offices');
		const Agents = database.collection('Agents');
		const Messages = database.collection('Messages');

		this.setState({loading: true});
		this.fetchRelatedIds((err, {agents, messages}) => {
			if(err) {
				this.setState({loading: false});
				return;
			}

			const batch = database.batch();
			const {name, description, locations} = this.state;
			const {office} = this.props;
			const officeUpdate = { 
				name,
				description,
				locations,
				updated_at: new Date(),
			};
			const agentUpdate = {
				'Office.name': name,
			};
			const msgUpdate = {
				'Author.Office.name': name,
			};

			batch.update(Offices.doc(office.id), officeUpdate);
			agents.forEach(id => batch.update(Agents.doc(id), agentUpdate));
			messages.forEach(id => batch.update(Messages.doc(id), msgUpdate));

			batch.commit().then(() => {
				this.props.updateOfficeModel(officeUpdate);
				this.setState({loading: false});
				alert('Your office was successfully updated!');
			});
		});
	}

	/**
	 * Render the component's markup
	 * @return {ReactElement} 
	 */
	render() {
		const {name, description, locations, loading, errors} = this.state;
		const {id} = this.props.office;

		return (
			<Col sm={10} {...this.props}>
				<h3>Office information</h3>
				<Form onSubmit={this.handleUpdate}>
					<Form.Item label="Office ID">
						<Input value={id} disabled />
					</Form.Item>

					<Form.Item label="Office name">
						<Input 
							value={name}
							placeholder="Enter your office's name."
							onChange={({target: {value}}) => this.setState({name: value})}
							maxLength={40}
							required
						/>
					</Form.Item>

					<Form.Item label="Office description">
						<Input.TextArea
							value={description}
							rows={5}
							placeholder="Write a couple of sentence about what your practice is all about."
							onChange={({target: {value}}) => this.setState({description: value})}
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

OfficeSettingsForm.propTypes = {
	office: PropTypes.object.isRequired,
	updateOfficeModel: PropTypes.func.isRequired,
};

export default OfficeSettingsForm;