export default class Office {

	static SET_OFFICE_MODEL = 'SET_OFFICE_MODEL';
	static RESET_OFFICE_MODEL = 'RESET_OFFICE_MODEL';

	/**
	 * Return an action to set & merge office data
	 * @param {Object} data 
	 * @return {Object}
	 */
	static setOfficeModel(data) {
		return {
			type: this.SET_OFFICE_MODEL,
			data,
		};
	}

	/**
	 * Return an action to reset the office data
	 * @return {Object}
	 */
	static resetOfficeModel() {
		return {
			type: this.RESET_OFFICE_MODEL,
		};
	}
}