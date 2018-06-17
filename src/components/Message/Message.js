import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const Message = ({body, author, isAuthor, sentAt, seenAt, style: customStyle}) => {
	
	const containerStyle = {
		alignSelf: isAuthor ? 'flex-end' : 'flex-start',
		textAlign: isAuthor ? 'right' : 'left',
		padding: '15px 0',
	};

	const timestamp = {
		fontSize: '.7em', 
		opacity: .65,
	};

	const selfTimestampColor = {
		color: seenAt ? '#0697de' : 'inherit',
	};


	const style = {
		backgroundColor: '#eee',
		padding: 15,
		margin: 0,
	};

	return (
		<div style={containerStyle}>
			<span>{author.name}:</span>
			<div style={{...customStyle}}>
				<p style={style}>{body}</p>
			</div>	
			{!isAuthor && 
				<span style={timestamp}>{moment(sentAt).format('h:mmA')}</span>}
			
			{isAuthor && 
			<span style={{...timestamp, ...selfTimestampColor}}>
				{seenAt ? 'Seen:' : 'Sent:'} {moment(seenAt ? seenAt : sentAt).format('h:mmA')}
			</span>}
		</div>
	);
}

Message.propTypes = {
	body: PropTypes.string.isRequired,
	author: PropTypes.shape({
	  	name: PropTypes.string.isRequired,
	}).isRequired,
	isAuthor: PropTypes.bool.isRequired,
	sentAt: PropTypes.object.isRequired,
	seenAt: PropTypes.object,
	style: PropTypes.object,
};

Message.defaultProps = {
	style: {},
	seenAt: null,
};

export default Message;