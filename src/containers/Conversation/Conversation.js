import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Layout, Button, Input, Icon, Form, Col } from 'antd';
import moment from 'moment';
import { database } from 'config/firebase';
import Message from 'components/Message';
import ChatDayLimit from 'components/Chat/ChatDayLimit';
import CustomerDetails from 'components/Chat/CustomerDetails';
import Loading from 'components/LoadingSpinner';
import bugsnagClient from 'lib/bugsnag';

class Conversation extends Component {

	/** The component's constructor */
	constructor(props) {
		super(props);

        this.messageList = React.createRef();
		this.state = this.getInitialState();

		this.asyncLoadHistory = this.asyncLoadHistory.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.isMessageTheLastSeen = this.isMessageTheLastSeen.bind(this);
		this.renderMessages = this.renderMessages.bind(this);
		this.handleMarkMessagesAsRead = this.handleMarkMessagesAsRead.bind(this);
		this.handleNewMsgSnapshot = this.handleNewMsgSnapshot.bind(this);
	}

	/**
	 * Return the component's initial state
	 * @return {Object} 
	 */
	getInitialState() {
		return {
			message: '',
			chat: [],
			loading: false,
			customer: {},
		};
	}

	/**
	 * Connect to the live DB to load the customer info and the messages of the conversation
	 */
	componentDidMount() {
		this.asyncLoadHistory();
		const Users = database.collection('Users');
		const {customer} = this.props;

		Users.doc(customer).get().then(doc => {
			const customer = { ...doc.data(), id: doc.id };
			this.setState({customer});
		});
	}

	/**
	 * Load the live chat log with this customer
	 * @return {Void} 
	 */
	asyncLoadHistory() {
		const {customer, user: {Office}} = this.props;
		const Messages = database.collection('Messages');

		this.setState({loading: true});

		// Messages that are sent
		Messages.where('Author.Office.id','==', Office.id).where('recipient', '==', customer)
		.onSnapshot(this.handleNewMsgSnapshot);

		// Messages that are received
		Messages.where('Author.id', '==', customer).where('recipient','==', Office.id)
		.onSnapshot(this.handleNewMsgSnapshot);
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
		 	this.mark
			if (change.type === 'added') { 
				this.setState((prevState) => ({
					chat: this.sortByDate([...prevState.chat, data])
				}));
				setTimeout(() => this.handleMarkMessagesAsRead(), 500);
                this.scrollToBottom();
	        }

	        if (change.type === 'modified') {
	        	// Update the corresponding msg
	        	const newChat = [ ...this.state.chat ];
	        	const index = newChat.findIndex(({id}) => id == data.id);
	        	newChat[index] = data;
	        	this.setState({chat: newChat});
	        }

	        if (change.type === 'removed') {
	        	// ..
	        }
	    });

	    this.setState({loading: false});
	}

	/**
	 * Update the messages received to mark them as seen
	 * @return {Void} 
	 */
	handleMarkMessagesAsRead() {
		const Messages = database.collection('Messages');
		const batch = database.batch();
		const {chat} = this.state;
		const {user} = this.props;

		chat.forEach(({id, Author, read_at}) => {
			if(Author.id != user.id && !read_at) { 
				batch.update(Messages.doc(id), {read_at: new Date()});
			}
		});

		batch.commit();
	}

	/**
	 * Handle the submit and send a message to the customer
	 * @param  {Event} e Submit event
	 * @return {Void}   
	 */
	sendMessage(e) {
		e.preventDefault();

		const {message} = this.state;
		const {user, customer: recipient} = this.props;
		const Messages = database.collection('Messages');
		const Author = {
			id: user.id,
			firstname: user.firstname,
			lastname: user.lastname,
			name: user.name,
			photo: user.photo,
			Office: user.Office,
			Role: user.Role,
		};
		const body = {
			type: 'text',
			content: message,
		};

		if(message.length < 3) {
			alert('Error: Message entered is too short.');
			return;
		}
		this.setState({message: ''});
		
		Messages.doc().set({ body, recipient, Author, created_at: new Date() })
		.catch(bugsnagClient.notify);
	}

	/**
	 * Sort the messages by the date they were sent
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

    /**
     * Scroll the chat history container to the bottom
     * @return {Void} 
     */
    scrollToBottom() {
        const {current} = this.messageList;
        const scrollHeight = current.scrollHeight;
        const height = current.clientHeight;
        const maxScrollTop = scrollHeight - height;
        ReactDOM.findDOMNode(current).scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }

    /**
     * Check whether a message was the last one to be seen
     * @param  {String}  id The ID of the message
     * @return {Boolean}    
     */
    isMessageTheLastSeen(id) {
    	const {Office} = this.props.user;
    	const messages = this.state.chat
    						.filter(msg => msg.read_at && msg.Author.Office)
	    					.sort((a, b) => a.read_at.toDate() > b.read_at.toDate() ? -1 : 1);

    	return messages[0] && messages[0].id == id;
    }

	/**
	 * Render the chat history
	 * @return {ReactElement} 
	 */
	renderMessages() {
		const {user} = this.props;
		const {chat} = this.state;

		if(chat.length == 0) {
			return <p>No messages were found between {user.Office.name} and this customer.</p>;
		}

		return chat.map(({id, body, Author, created_at, read_at}, i) => {
			const isDifferentDay = i == 0
								? true
								: moment(created_at.toDate()).isAfter(chat[i-1].created_at.toDate(), 'day');

			return (
				<div key={id}>
					{isDifferentDay && <ChatDayLimit date={created_at.toDate()} />}
					<Message 
						body={body}
						author={Author}
						isAuthor={Author.id == user.id} 
						sentAt={created_at.toDate()}
						readAt={read_at ? read_at.toDate() : null}
						showReadReceipt={this.isMessageTheLastSeen(id)}
					/>
				</div>
			);
		});
	}

	/**
	 * Render the component's markup
	 * @return {ReactElement} 
	 */
	render() {
		const {customer, message, loading} = this.state;
		
		return (
			<Layout.Content style={{padding: 24, backgroundColor: '#fff'}}>
				<Col md={6}>
					{!customer.id && <Loading isComponent={true} />}
					{customer.id && <CustomerDetails customer={customer} />}
				</Col>
				<Col md={12}>
	                <div ref={this.messageList} style={{overflow: 'scroll' , height: '80vh'}}>	
	                {loading && <Loading isComponent={true} />}
	                    {this.renderMessages()}
					</div>
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
				</Col>
			</Layout.Content>
		);
	}
}

Conversation.propTypes = {
	user: PropTypes.object.isRequired,
	customer: PropTypes.string.isRequired,
};

export default Conversation;