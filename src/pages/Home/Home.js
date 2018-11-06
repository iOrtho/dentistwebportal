import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Breadcrumb, Menu, Icon } from 'antd';
import SideMenu from 'components/SideMenu';
import { database, messaging } from 'config/firebase';
import DashboardStats from 'components/DashboardStats';
import Conversation from 'containers/Conversation';

class Home extends Component {

	/** The component's constructor */
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.loadListOfConversations = this.loadListOfConversations.bind(this);
		this.openConversation = this.openConversation.bind(this);
		this.requestPermissions = this.requestPermissions.bind(this);
	}

	/**
	 * Return the component's initial state
	 * @return {Object} 
	 */
	getInitialState() {
		return {
			conversations: {},
			loading: false,
			currentView: 'stats',
			customerId: null,
		};
	}

	/**
	 * Connect to the live message data to get a list of conversations 
	 */
	componentDidMount() {
		this.loadListOfConversations();
		this.requestPermissions();
	}

	/**
	 * Ask the user to give permissions to send notifications
	 * @return {Void} 
	 */
	requestPermissions() {	
		const Agents = database.collection('Agents');
		const {id, notification_token} = this.props.user;

		if(notification_token) return;

		messaging.requestPermission()
			.then(() => {
				messaging.getToken().then((token) => {
					Agents.doc(id).update({'notification_token': token, updated_at: new Date()});
				});
			})
			.catch(console.error);
	}

	/**
	 * Connect to the live database to load the list of the conversations
	 * @return {Void} 
	 */
	loadListOfConversations() {
		const {id} = this.props.user.Office;

		this.setState({loading: true});
		database.collection('Messages').where('recipient','==', id)
		.onSnapshot(snapshot => {
			const conversations = { ...this.state.conversations};
			const counts = {};
			snapshot.docChanges().forEach(change => {
				const {Author, read_at} = { ...change.doc.data() };

				// count the # of unread msgs
				if(!read_at) {
					counts[Author.id] ? counts[Author.id]++ : counts[Author.id] = 1;
				}

				if(change.type == 'added' && !conversations[Author.id] && !Author.Office) {
					conversations[Author.id] = Author;
				}				
			});

			Object.keys(counts).forEach(customerId => conversations[customerId].unread = counts[customerId]);

			this.setState({conversations, loading: false});
		});
	}

	/**
	 * Open the conversation with a given customer
	 * @param  {String} customerId The ID of the customer
	 * @return {Void}            
	 */
	openConversation(customerId) {
		this.setState({currentView: 'chat', customerId})
	}

	/**
	 * Render the component's markup
	 * @return {ReactElement} 
	 */
	render() {
		const {conversations, loading, currentView, customerId} = this.state;
		const {user, history} = this.props;

		return (
			<Layout>
				<SideMenu
					conversations={conversations}
					onOpenConvo={this.openConversation}
					onOpenHome={() => this.setState({currentView: 'stats'})}
				/>
				<Layout style={{ padding: '0 24px 24px' }}>
					<Breadcrumb style={{ margin: '16px 0' }}>
						<Breadcrumb.Item>Home</Breadcrumb.Item>
						{(currentView == 'stats') && <Breadcrumb.Item>Dashboard</Breadcrumb.Item>}
						{(currentView == 'chat') && <Breadcrumb.Item>Chat</Breadcrumb.Item>}
					</Breadcrumb>
					{(() => {
						if(currentView == 'chat') {
							return <Conversation user={user} customer={customerId} />;
						}else {
							return <DashboardStats user={user} />;
						}
					})()}
      			</Layout>
  			</Layout>
		);
	}
}

export default connect(mapStateToProps)(Home);

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