import React, { Component } from 'react';
import { connect } from 'react-redux';
import App from 'containers/App';
import { database } from 'config/firebase';
import { Form, Input, Button } from 'antd';
import Message from 'components/Message';

const customerId = 'KHHNbjR2iooYQJpHyfSq';

class Chat extends Component {

	/** The component's constructor */
	constructor(props) {
		super(props);

		this.state = this.getInitialState();

		this.sendMessage = this.sendMessage.bind(this);
		this.loadMessages = this.loadMessages.bind(this);
		this.handleNewMsgSnapshot = this.handleNewMsgSnapshot.bind(this);
		this.renderChatHistory = this.renderChatHistory.bind(this);
	}

	/**
	 * Return the component's initial state
	 * @return {Object} 
	 */
	getInitialState() {
		return {
			chat: [],
			message: '',
			isLoading: false,
		};
	}

	/**
	 * Connect to the live DB to load the messages of the conversation
	 */
	componentDidMount() {
		this.loadMessages();
	}

	/**
	 * Load the live chat log with this customer
	 * @return {Void} 
	 */
	loadMessages() {
		const {id} = this.props.user;
		const Messages = database.collection('Messages');

		if(!id) return;

		this.setState({isLoading: true});

		// Messages that are sent
		Messages.where('Author.id','==', id).onSnapshot(this.handleNewMsgSnapshot);

		// Messages that are received
		Messages.where('recipient','==', id).onSnapshot(this.handleNewMsgSnapshot);
	}

	/**
	 * Handle the Firebase async response to fetch messages
	 * @param  {Snapshot} snapshot The snapshot element
	 * @return {Void}          
	 */
	handleNewMsgSnapshot(snapshot) {
		const {chat} = this.state;

		snapshot.docChanges().forEach(change => {
			const data = {
		 		...change.doc.data(), 
		 		id: change.doc.id,
		 	};

			if (change.type === 'added') { 
				this.setState((prevState) => ({
					chat: this.sortByDate([...prevState.chat, data])
				}));
	        }

	        if (change.type === 'modified') {
	        	// ..
	        }

	        if (change.type === 'removed') {
	        	// ..
	        }
	    });

	    this.setState({isLoading: false});
	}

	/**
	 * Sort the messages by the date of creation
	 * @param  {Array} messages The messages to sort
	 * @return {Array}          
	 */
	sortByDate(messages) {
		const sorted = [...messages];
		sorted.sort((first, second) => {
			const a = new Date(first.created_at.seconds);
			const b = new Date(second.created_at.seconds);

			return a - b;
		});

		return sorted;
	}

	sendMessage(e) {
		e.preventDefault();
		
		const {message: body} = this.state;
		const {id, name} = this.props.user;
		const recipient = customerId;

		if(body.length < 3) return;

		this.setState({message: ''});
		
		database.collection('Messages').doc().set({
			body,
			recipient,
			Author: {
				id,
				name,
			},
			created_at: new Date(),
		})
		.then(() => {
			console.log('Successfully sent message!');
		})
		.catch((err) => {
			console.log('Error:', err);
		})
	}

	/**
	 * Render the chat history
	 * @return {ReactElement} 
	 */
	renderChatHistory() {
		const {user} = this.props;
		const {chat} = this.state;

		return chat.map(({id, body, Author}) => {
			return (<Message 
						key={id}
						content={body}
						author={Author}
						isAuthor={Author.id == user.id} 
					/>);
		});
	}

	/**
	 * Render the component's markup
	 * @return {ReactElement} 
	 */
	render() {
		const {message} = this.state;

		return (
			<App>
				<div style={{width: 640, margin: '0 auto', backgroundColor: '#fbfbfb85'}}>
					Here are your messages young sir!
					{this.renderChatHistory()}
					<Form layout="inline" onSubmit={this.sendMessage}>
						<Form.Item>
							<Input 
								value={message}
								placeholder="Enter the message you want to send"
								onPressEnter={this.sendMessage}
								onChange={({target: {value}}) => this.setState({message: value})}
								style={{width: '400px'}}
							/>
						</Form.Item>

						<Form.Item>
							<Button type="primary" htmlType="submit" onClick={this.sendMessage}>
								Send Message
							</Button>
						</Form.Item>
					</Form>
				</div>
			</App>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);

/**
 * Map the store's state to the component's props
 * @param  {Object} state.user The user's User model 
 * @param  {Object} state.chat The chat 
 * @return {Object}       
 */
function mapStateToProps({user, chat}) {
	return {
		user,
		chat,
	};
}
	
/**
 * Map the actions and dispatch of the store to the component's props
 * @param  {Function} dispatch The action dispatcher
 * @return {Object}          
 */
function mapDispatchToProps(dispatch) {
	return {

	};
}