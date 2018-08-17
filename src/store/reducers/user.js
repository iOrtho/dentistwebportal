import UserAction from '../actions/user';

const initialState = {
	id: null,
	authCheckStatus: false,
};

export default function user(state = initialState, action) {
	switch(action.type) {

		case UserAction.SET_USER_MODEL:
			return { ...state, ...action.data };

		case UserAction.SET_AUTH_CHECK_STATUS:
			return { ...state, authCheckStatus: true };

		case UserAction.RESET_USER_MODEL:
			return initialState;

		case UserAction.UPDATE_OFFICE_MODEL:
			return {
				...state,
				Office: { 
					...state.Office,
					...action.data,
				},
			};

		default:
			return state;
	}
}