export default class Office {

	static SET_OFFICE_MODEL = 'SET_OFFICE_MODEL';
	static RESET_OFFICE_MODEL = 'RESET_OFFICE_MODEL';

	/**
	 * Return the action to set the office model
	 * @param {Object} data The office's datas
	 * @return {Object} 
	 */
	static setOfficeModel(data) {
		return {
			type: this.SET_OFFICE_MODEL,
			data,
		};
	}

	/**
	 * Return the action to reset the office model to the default values
	 * @return {Object} 
	 */
	static resetOfficeModel() {
		return {
			type: this.RESET_OFFICE_MODEL,
		};
	}
}