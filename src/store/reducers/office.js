import OfficeAction from '../actions/office';

const initialState = {
	id: null,
	ready: false,
};

export default function office(state = initialState, action) {
	switch(action.type) {

		case OfficeAction.SET_OFFICE_MODEL:
			return {
				...state,
				...action.data,
			};

		default:
			return state;
	}
}