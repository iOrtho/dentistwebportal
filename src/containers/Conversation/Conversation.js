import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Layout, Button, Input, Icon, Form } from 'antd';
import { database } from 'config/firebase';
import Message from 'components/Message';
import Loading from 'components/LoadingSpinner';

class Conversation extends Component {

	/** The component's constructor */
	constructor(props) {
		super(props);

        this.messageList = React.createRef();
		this.state = this.getInitialState();

		this.asyncLoadHistory = this.asyncLoadHistory.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.renderMessages = this.renderMessages.bind(this);
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
	 * Connect to the live DB to load the messages of the conversation
	 */
	componentDidMount() {
		this.asyncLoadHistory();
	}

	/**
	 * Load the live chat log with this customer
	 * @return {Void} 
	 */
	asyncLoadHistory() {
		const {id} = this.props.user.Office;
		const Messages = database.collection('Messages');

		this.setState({loading: true});

		// Messages that are sent
		Messages.where('Author.Office.id','==', id).onSnapshot(this.handleNewMsgSnapshot);

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
                this.scrollToBottom();
	        }

	        if (change.type === 'modified') {
	        	// ..
	        }

	        if (change.type === 'removed') {
	        	// ..
	        }
	    });

	    this.setState({loading: false});
	}

	/**
	 * Handle the submit and send a message to the customer
	 * @param  {Event} e Submit event
	 * @return {Void}   
	 */
	sendMessage(e) {
		const {message: body} = this.state;
		const {user, customer: recipient} = this.props;
		const Author = {
			id: user.id,
			firstname: user.firstname,
			lastname: user.lastname,
			name: user.name,
			photo: user.photo,
			Office: user.Office,
			Role: user.Role,
		};
		e.preventDefault();

		if(body.length < 3) return;
		this.setState({message: ''});
		
		database.collection('Messages').doc().set({
			body,
			recipient,
			Author,
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
	 * Render the chat history
	 * @return {ReactElement} 
	 */
	renderMessages() {
		const {user} = this.props;
		const {chat} = this.state;

		if(chat.length == 0) {
			return <p>No messages were found between {user.Office.name} and this customer.</p>;
		}

		return chat.map(({id, body, Author, created_at, seen_at}) => {
			return (<Message 
						key={id}
						body={body}
						author={Author}
						isAuthor={Author.id == user.id} 
						sentAt={new Date(created_at.seconds)}
						seenAt={seen_at ? new Date(seen_at.seconds) : null}
					/>);
		});
	}

	/**
	 * Render the component's markup
	 * @return {ReactElement} 
	 */
	render() {
		const {message, loading} = this.state;

		return (
			<Layout.Content style={{width: 640, padding: 24, margin: '0 auto', backgroundColor: '#fff'}}>
                <div ref={this.messageList} style={{overflow: 'scroll' , height: '80vh'}}>	
                {loading && <Loading isComponent={true} />}
                    {this.renderMessages()}
					{this.renderMessages()}
					{this.renderMessages()}
					{this.renderMessages()}
					{this.renderMessages()}
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
			</Layout.Content>
		);
	}
}

Conversation.propTypes = {
	user: PropTypes.object.isRequired,
	customer: PropTypes.string.isRequired,
};

export default Conversation;