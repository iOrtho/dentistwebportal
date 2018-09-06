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
			picture: '',
			loading: false,
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

		this.props.form.validateFields((err, values) => {
			if(!err) {
				const {firstname, middlename, lastname, biography} = values;

				this.setState({loading: true});
				Offices.doc(this.props.officeId).update({
					doctors: [{firstname, middlename, lastname, biography, updated_at: new Date()}],
				})
				.then(() => {
					this.setState({loading: false});
					alert('The doctor\'s info was successfully updated!');
				})
				.catch(err => {
					console.error(err);
					this.setState({loading: false});
					alert('An error occured, please try again.');
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
		const {officeId, doctor: {firstname, middlename, lastname, biography}, ...others} = this.props;
		const {picture, loading} = this.state;

		return (
			<div {...others}>
				<h3>Doctor's information</h3>
				<Form onSubmit={this.handleUpdate}>
					<Row>
						<Col span={12}>
							<Form.Item label="Doctor's first name">
								{this.props.form.getFieldDecorator('firstname', {
									initialValue: firstname,
									rules: [
										{required: true, whitespace: true, message: 'Please enter the doctor\'s first name.'},
										{max: 30, message: 'The first name needs to be less than 30 characters.'},
										{min: 2, message: 'The first name you entered is too short.'},
									],
								})(
									<Input placeholder="Enter the principal doctor's first name." maxLength={30} />
								)}
							</Form.Item>
							<Form.Item label="Doctor's middle name">
								{this.props.form.getFieldDecorator('middlename', {
									initialValue: middlename,
									rules: [
										{max: 30, message: 'The middle name needs to be less than 30 characters.'},
									],
								})(
									<Input placeholder="Enter the middle name or initial. (Optional)" maxLength={30} />
								)}
							</Form.Item>
							<Form.Item label="Doctor's last name">
								{this.props.form.getFieldDecorator('lastname', {
									initialValue: lastname,
									rules: [
										{required: true, whitespace: true, message: 'Please enter the doctor\'s last name.'},
										{max: 30, message: 'The last name needs to be less than 30 characters.'},
										{min: 2, message: 'The last name you entered is too short.'},
									],
								})(
									<Input placeholder="Enter the last name." maxLength={30} />
								)}
							</Form.Item>
						</Col>
						<Col span={12}>
							<div style={{width: 375, height: 220, margin: '0 auto 3em auto', background: `url("${picture}")`}}>
								<ImageCropper
									text="Upload a photo of the doctor"
									isBack={true}
									apply={this.handleImageUpload}
								/>
							</div>
						</Col>
					</Row>
					<Form.Item label="Doctor's biography">
						{this.props.form.getFieldDecorator('biography', {
							initialValue: biography,
							rules: [
								{required: true, whitespace: true, message: 'Please enter the doctor\'s biography.'},
								{max: 500, message: 'The biography needs to be less than 500 characters.'},
								{min: 30, message: 'The biography you entered is too short.'},
							],
						})(
							<Input.TextArea
								placeholder="Tell us a little bit more about the doctor behind the practice"
								maxLength={500}
								rows={5}
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

DoctorSettingsForm.propTypes = {
	doctor: PropTypes.object.isRequired,
	officeId: PropTypes.string.isRequired,
};

export default Form.create()(DoctorSettingsForm);