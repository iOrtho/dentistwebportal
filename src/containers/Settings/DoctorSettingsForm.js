import React, { Component } from 'react';
import { Layout, Form, Input, Col, Row, Button } from 'antd';
import { database, storage } from 'config/firebase';
import ImageCropper from 'react-avatar-image-cropper';
import PropTypes from 'prop-types';

class DoctorSettingsForm extends Component {

	/** The component's constructor */
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleImageUpload = this.handleImageUpload.bind(this);
	}

	/**
	 * Load the doctor's information into the form
	 */
	componentDidMount() {
		const {firstname, middlename, lastname, position, picture, biography} = this.props.doctor;
		this.setState({firstname, middlename, lastname, position, picture, biography});
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
			picture: '',
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
		const {firstname, middlename, lastname, biography, picture} = this.state;

		this.setState({loading: true});
		Offices.doc(this.props.officeId).update({
			doctors: [{firstname, middlename, lastname, biography, picture, updated_at: new Date()}],
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
	 * Upload the image file to the Firebase storage
	 * @param  {Blob} file The uploaded photo
	 * @return {VOid}      
	 */
	handleImageUpload(file) {
		const {officeId, doctor} = this.props;
		const extension = file.name.match(/\.(\w+)/)[1];
		const ref = storage.ref().child(`images/offices/doctors/${officeId}-${Date.now()}.${extension}`);
		const Offices = database.collection('Offices');

		ref.put(file, {contentType: file.type})
			.then(_ => {
				ref.getDownloadURL()
					.then(url => {
						Offices.doc(officeId).update({
							"doctors": [{ ...doctor, picture: url }],
						})
							.then(() => this.setState({picture: url}))
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
		const {firstname, middlename, lastname, biography, picture, loading, errors} = this.state;
		const {officeId, doctor, ...others} = this.props;

		return (
			<div {...others}>
				<h3>Doctor's information</h3>
				<Form onSubmit={this.handleUpdate}>
					<Row>
						<Col span={12}>
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
						</Col>
						<Col span={12}>
							<div style={{width: 375, height: 220, margin: '0 auto 3em auto', background: `url("${picture}")`}}>
								<ImageCropper
									text="Upload a photo of your practice"
									isBack={true}
									apply={this.handleImageUpload}
								/>
							</div>
						</Col>
					</Row>
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
			</div>
		);
	}
}

DoctorSettingsForm.propTypes = {
	doctor: PropTypes.object.isRequired,
	officeId: PropTypes.string.isRequired,
};

export default DoctorSettingsForm;