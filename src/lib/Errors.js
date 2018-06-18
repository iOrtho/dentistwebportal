import { validate } from 'indicative';

export default class Errors {

	constructor(rules) {
		this.errors = {};
		this.rules = rules;
		this.messages = {
			'required': 'The {{ field }} is required.',
			'email': 'The {{ field }} is not a valid email address.',
			'min': 'The {{ field }} must be at least {{ argument.0 }} characters.',
			'confirmed': 'The {{ field }} and its repeated value must be equal. ',
		};
	}

	/**
	 * Evaluate whether a given field has an error
	 * @param  {String}  name The name of the field
	 * @return {Boolean}      
	 */
	has(name) {
		return this.errors[name] && this.errors[name].length > 0;
	}

	/**
	 * Get the error message for a given field
	 * @param  {String} name The name of the field
	 * @return {String}      
	 */
	get(name) {
		return this.errors[name];
	}

	verify(data) {
		return new Promise((resolve, reject) => {
			validate(data, this.rules, this.messages).then(resolve)
			.catch(errors => {
				errors.forEach(({field, message}) => this.errors[field] = message);
				reject(this.errors);
			});
		});
	}
}