import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const CustomerDetails = ({customer, style: customStyle}) => {

	const style = {};
	const infoStyle = {
		fontWeight: 'bold',
		fontSize: '1.2em',
	};
	const customerInfo = {
		Name: customer.name,
		'Downloaded-on': moment(customer.created_at.toDate()).format('MMM D, YYYY'),
	};

	return (
		<div style={{...style, ...customStyle}}>
			<h2>Customer Information</h2>
			{Object.keys(customerInfo).map((label, i) => {
				return (
					<div key={i}>
						<label>{label.replace('-', ' ')}:</label>
						<p style={infoStyle}>{customerInfo[label]}</p>
					</div>
				);	
			})}
		</div>
	);
}

CustomerDetails.propTypes = {
	customer: PropTypes.object.isRequired,
	style: PropTypes.object,
};

CustomerDetails.defaultProps = {
	style: {},	
};

export default CustomerDetails;