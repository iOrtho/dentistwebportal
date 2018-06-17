export default class Chat {

	static ADD_NEW_MESSAGE = 'ADD_NEW_MESSAGE';

	/**
	 * Return an action to add a new message to the conversation
	 * @param {Object} message The message to add
	 * @return {Object} 
	 */
	static addNewMessage(message) {
		return {
			type: this.ADD_NEW_MESSAGE,
			message,
		};
	}
}