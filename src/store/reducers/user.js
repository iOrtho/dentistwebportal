import UserAction from '../actions/user';

const initialState = {
	id: null,
};

export default function user(state = initialState, action) {
	switch(action.type) {

		case UserAction.SET_USER_MODEL:
			return {...state, ...action.data};

		default:
			return state;
	}
}