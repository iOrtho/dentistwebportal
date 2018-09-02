import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const Message = ({body, author, isAuthor, sentAt, readAt, showReadReceipt, style: customStyle}) => {
	
	const containerStyle = {
		alignSelf: isAuthor ? 'flex-end' : 'flex-start',
		textAlign: isAuthor ? 'right' : 'left',
		float: isAuthor ? 'right' : 'left',
		padding: '15px 0',
		width: '80%',
	};

	const timestamp = {
		fontSize: '.7em', 
		opacity: .65,
	};

	const selfTimestampColor = {
		color: showReadReceipt ? '#0697de' : 'inherit',
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
				{body.type == 'text' && <p style={style}>{body.content}</p>}
			</div>	
			{!isAuthor && 
				<span style={timestamp}>{moment(sentAt).format('h:mmA')}</span>}
			
			{isAuthor && 
			<span style={{...timestamp, ...selfTimestampColor}}>
				{showReadReceipt ? 'Seen' : 'Sent'} at: {moment(readAt ? readAt : sentAt).format('h:mmA')}
			</span>}
		</div>
	);
}

Message.propTypes = {
	body: PropTypes.shape({
	  type: PropTypes.oneOf(['text', 'image', 'video']).isRequired,
	}).isRequired,
	author: PropTypes.shape({
	  	name: PropTypes.string.isRequired,
	}).isRequired,
	isAuthor: PropTypes.bool.isRequired,
	sentAt: PropTypes.object.isRequired,
	readAt: PropTypes.object,
	showReadReceipt: PropTypes.bool,
	style: PropTypes.object,
};

Message.defaultProps = {
	style: {},
	readAt: null,
	showReadReceipt: false,
};

export default Message;