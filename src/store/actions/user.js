export default class User {

	static SET_USER_MODEL = 'SET_USER_MODEL';
	static RESET_USER_MODEL = 'RESET_USER_MODEL';
	static SET_AUTH_CHECK_STATUS = 'SET_AUTH_CHECK_STATUS';
	static UPDATE_OFFICE_MODEL = 'UPDATE_OFFICE_MODEL';

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
	 * Return the action to set the user's auth check status to true
	 * @return {Object} 
	 */
	static setAuthCheckStatus() {
		return {
			type: this.SET_AUTH_CHECK_STATUS,
		};
	}

	/**
	 * Return the action to reset the user's model
	 * @return {Object} 
	 */
	static restUserModel() {
		return {
			type: this.RESET_USER_MODEL,
		};
	}

	/**
	 * Return the action to update the office's model of this agent
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