export default class Office {

	static SET_OFFICE_MODEL = 'SET_OFFICE_MODEL';

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
}