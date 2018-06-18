import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const ChatDayLimit = ({date, style: customStyle}) => {
	
	const style = {
		textAlign: 'center',
		margin: '1em 0',
		opacity: .6,
	};

	return (
		<div style={{...style,...customStyle}}>
			{moment(date).format('dddd, MMMM Do YYYY')}
		</div>
	);
}

ChatDayLimit.propTypes = {
	date: PropTypes.object.isRequired,
};

export default ChatDayLimit;