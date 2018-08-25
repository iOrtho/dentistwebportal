export default class User {

	static SET_USER_MODEL = 'SET_USER_MODEL';
	static UPDATE_OFFICE_MODEL = 'UPDATE_OFFICE_MODEL';
	static RESET_USER_MODEL = 'RESET_USER_MODEL';

	/**
	 * Return the action to set the user model
	 * @param {Object} data The user's datas
	 * @return {Object} 
	 */
	static setUserModel(data) {
		return {
			type: this.SET_USER_MODEL,
			data,
		};
	}

	/**
	 * Return the action to reset the user model on logout
	 * @param {Object} data The user model
	 * @return {Object} 
	 */
	static resetUserModel() {
		return {
			type: this.RESET_USER_MODEL,
		};
	}

	/**
	 * Return the action to update the office model of this agent
	 * @param {Object} data The office's datas
	 * @return {Object} 
	 */
	static updateOfficeModel(data) {
		return {
			type: this.UPDATE_OFFICE_MODEL,
			data,
		};
	}
}