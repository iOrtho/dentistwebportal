export default class User {

	static SET_USER_MODEL = 'SET_USER_MODEL';
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