import OfficeAction from '../actions/office';

const initialState = {
	id: 'HfOnKBLWjp3lwT8K6aGe',
	ready: false,
};

export default function office(state = initialState, action) {
	switch(action.type) {

		case OfficeAction.SET_OFFICE_MODEL:
			return {
				...state,
				...action.data,
			};

		case OfficeAction.RESET_OFFICE_MODEL:
			return initialState;

		default:
			return state;
	}
}