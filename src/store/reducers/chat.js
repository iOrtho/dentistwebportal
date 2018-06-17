import ChatAction from '../actions/chat';

const initialState = {
	messages: [],
	meta: {
		isLoading: false,
		lastFetched: null,
	}
};

/**
 * Modify the messages array to sort it by date
 * @param  {Array} messages The messages to sort
 * @return {Array}          
 */
function sortByDate(messages) {
	const sorted = [...messages];
	sorted.sort((first, second) => {
		const a = new Date(first.created_at.seconds);
		const b = new Date(second.created_at.seconds);

		return a - b;
	});

	return sorted;
}

export default function chat(state = initialState, action) {
	switch(action.type) {

		case ChatAction.ADD_NEW_MESSAGE:
			return {
				...state,
				messages: sortByDate([...state.messages, message])
			};

		default:
			return state;
	}
}