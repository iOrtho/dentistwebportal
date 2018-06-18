import React, { Component } from 'react';
import { Layout, Form, Input, Col, Button } from 'antd';
import { connect } from 'react-redux';
import { database } from 'config/firebase';
import UserAction from 'store/actions/user';

const officeId = 'HfOnKBLWjp3lwT8K6aGe';

class Profile extends Component {

	/** The component's constructor */
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.fetchRelatedDataIds = this.fetchRelatedDataIds.bind(this);
		this.handleUpdateOffice = this.handleUpdateOffice.bind(this);
	}

	/**
	 * Return the component's initial state
	 * @return {Object} 
	 */
	getInitialState() {
		return {
			name: '',
			address: [],
			loading: false,
			errors: {},
		};
	}

	/**
	 * Load the office's information from the database
	 */
	componentDidMount() {
		const Offices = database.collection('Offices');

		Offices.doc(officeId).onSnapshot(doc => {
			const data = { ...doc.data() };
			this.setState({name: data.name});
		});
	}

	/**
	 * Get the IDs of all the documents that will need updating
	 * @param  {Function} cb The callback function
	 * @return {Void}      
	 */
	fetchRelatedDataIds(cb) {
		const Agents = database.collection('Agents');
		const Messages = database.collection('Messages');
		const agentsId = [];
		const msgsId = [];

		Promise.all([
			Agents.where('Office.id','==', officeId).get(),
			Messages.where('Author.Office.id','==', officeId).get(),
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
	 * @param  {Event} e Submit event
	 * @return {Void}   
	 */
	handleUpdateOffice(e) {
		e.preventDefault();

		const Offices = database.collection('Offices');
		const Agents = database.collection('Agents');
		const Messages = database.collection('Messages');
		const {Office: OfficeData} = this.props.user;

		this.setState({loading: true});
		this.fetchRelatedDataIds((err, {agents, messages}) => {
			if(err) {
				this.setState({loading: false});
				return;
			}

			const batch = database.batch();
			const {name} = this.state;
			const officeUpdate = { 
				name,
				updated_at: new Date(),
			};
			const agentUpdate = {
				'Office.name': name,
			};
			const msgUpdate = {
				'Author.Office.name': name,
			};

			batch.update(Offices.doc(officeId), officeUpdate);
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
		const {name, loading, errors} = this.state;
		const wrapper = { 
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
		};
		const content = {
			width: 800,
			margin: '24px auto',
			padding: 24,
			backgroundColor: '#fff',
		};

		return (
			<Layout.Content style={wrapper}>
				<Layout.Content style={content}>
					<p>This what your app is all about, keep this information updated.</p>
					
					<Col sm={10}>
						<Form onSubmit={this.handleUpdateOffice}>
							<Form.Item label="Office ID">
								<Input value={officeId} disabled />
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
				</Layout.Content>
  			</Layout.Content>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

/**
 * Map the store's state to the component's props
 * @param  {Object} state.user The user's Agent model 
 * @return {Object}       
 */
function mapStateToProps({user}) {
	return {
		user,
	};
}


/**
 * Map the actions and dispatch of the store to the component's props
 * @param  {Function} dispatch The store's action dispatcher
 * @return {Object}          
 */
function mapDispatchToProps(dispatch) {
	return {
		updateOfficeModel: (data) => dispatch(UserAction.updateOfficeModel(data)),
	};
}