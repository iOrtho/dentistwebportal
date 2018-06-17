export default class User {

	static SET_USER_MODEL = 'SET_USER_MODEL';

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
}