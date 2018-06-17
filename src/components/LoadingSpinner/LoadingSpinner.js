import React from 'react';
import PropTypes from 'prop-types';
import { CircleLoader } from 'react-spinners';

const LoadingSpinner = ({isComponent}) => {

	const loader = {
		position: 'fixed',
		width: '100%',
		height: '100%',
	};

	const spinner = {
		position: 'relative',
    	top: '50%',
    	left: '50%',
	};

	return (
		<div className="loader" style={isComponent ? null : loader}>
			<div style={spinner}>
			<CircleLoader color="#09e" />	
			</div>
		</div>
	);
};

LoadingSpinner.propTypes = {
	isComponent: PropTypes.bool,
};

LoadingSpinner.defaultProps = {
	isComponent: false,
}

export default LoadingSpinner;