import React, { Component } from 'react';
import { Layout, Form, Input, Col, Row, Button } from 'antd';
import { database, storage } from 'config/firebase';
import UserAction from 'store/actions/user';
import ImageCropper from 'react-avatar-image-cropper';
import PropTypes from 'prop-types';

class OfficeSettingsForm extends Component {

	/** The component's constructor */
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleUpdate = this.handleUpdate.bind(this);
		this.fetchRelatedIds = this.fetchRelatedIds.bind(this);
		this.handleImageUpload = this.handleImageUpload.bind(this);
	}

	/**
	 * Return the component's initial state
	 * @return {Object} 
	 */
	getInitialState() {
		return {
			photo: '',
			locations: [],
			loading: false,
		};
	}

	/**
	 * Load the office's information into the form
	 */
	componentDidMount() {
		const {locations, pictures} = this.props.office;
		this.setState({locations, photo: pictures[0]});
	}

	/**
	 * Get the IDs of all the documents that will need updating
	 * @param  {Function} cb The callback function
	 * @return {Void}      
	 */
	fetchRelatedIds(cb) {
		const Agents = database.collection('Agents');
		const Messages = database.collection('Messages');
		const {id} = this.props.office;
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

		this.props.form.validateFields((err, values) => {
			if(!err) {
				this.setState({loading: true});
				this.fetchRelatedIds((err, {agents, messages}) => {
					if(err) {
						this.setState({loading: false});
						return;
					}

					const batch = database.batch();
					const {name, description} = values;
					const {office} = this.props;
					const officeUpdate = { name, description, updated_at: new Date() };
					const agentUpdate = { 'Office.name': name };
					const msgUpdate = { 'Author.Office.name': name };

					batch.update(Offices.doc(office.id), officeUpdate);
					agents.forEach(id => batch.update(Agents.doc(id), agentUpdate));
					messages.forEach(id => batch.update(Messages.doc(id), msgUpdate));

					batch.commit().then(() => {
						this.setState({loading: false});
						alert('Your office was successfully updated!');
					});
				});
			}
		});
		
	}

	/**
	 * Upload the image file to the Firebase storage
	 * @param  {Blob} file The uploaded photo
	 * @return {VOid}      
	 */
	handleImageUpload(file) {
		const {id} = this.props.office;
		const extension = file.name.match(/\.(\w+)/)[1];
		const ref = storage.ref().child(`images/offices/locations/${id}-${Date.now()}.${extension}`);
		const Offices = database.collection('Offices');

		ref.put(file, {contentType: file.type})
			.then(_ => {
				ref.getDownloadURL()
					.then(url => {
						Offices.doc(id).update({"pictures": [url]})
							.then(() => this.setState({photo: url}))
							.catch(console.error);
					})
					.catch(console.error);
			})
			.catch(console.error);
	}

	/**
	 * Render the component's markup
	 * @return {ReactElement} 
	 */
	render() {
		const {locations, photo, loading, errors} = this.state;
		const {id, name, description} = this.props.office;
		const divProps = { ...this.props };
		delete divProps.updateOfficeModel;
		delete divProps.office;

		return (
			<div {...divProps}>
				<h3>Office information</h3>
				<Form onSubmit={this.handleUpdate}>
					<Row>
						<Col span={12}>
							<Form.Item label="Office ID">
								<Input value={id} disabled />
							</Form.Item>

							<Form.Item label="Office name">
								{this.props.form.getFieldDecorator('name', {
									initialValue: name,
									rules: [
										{required: true, whitespace: true, message: 'Please enter your pratice\'s name.'},
										{max: 40, message: 'The name needs to be less than 40 characters.'},
										{min: 3, message: 'The name you entered is too short.'},
									],
								})(
									<Input placeholder="Enter your practice's name." maxLength={40} />
								)}
							</Form.Item>
						</Col>
						<Col span={12}>
							<div style={{width: 375, height: 220, margin: '0 auto 3em auto', background: `url("${photo}")`}}>
								<ImageCropper
									text="Upload a photo of your practice"
									isBack={true}
									apply={this.handleImageUpload}
								/>
							</div>
						</Col>
					</Row>

					<Form.Item label="Office description">
						{this.props.form.getFieldDecorator('description', {
							initialValue: description,
							rules: [
								{required: true, whitespace: true, message: 'Please enter your pratice\'s description.'},
								{max: 500, message: 'The description needs to be less than 500 characters.'},
								{min: 40, message: 'The description you entered is too short.'},
							],
						})(
							<Input.TextArea
								rows={5}
								placeholder="Write a couple of sentence about what your practice is all about."
								maxLength={500}
							/>
						)}
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
			</div>
		);
	}
}

OfficeSettingsForm.propTypes = {
	office: PropTypes.object.isRequired,
	updateOfficeModel: PropTypes.func.isRequired,
};

export default Form.create()(OfficeSettingsForm);