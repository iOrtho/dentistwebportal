import React from 'react';
import { Layout } from 'antd';
import PropTypes from 'prop-types';

const DashboardStats = ({user, style: customStyle}) => {
	const style = { background: '#fff', padding: 24, margin: 0, minHeight: 280 };

	return (
		<Layout.Content style={{...style,...customStyle}}>
			Hey {user.firstname}, Welcome to the dashboard of <b>{user.Office.name}</b>.
			<br/>
			Stats about the company: 9999 downloads in the past 3 seconds!
		</Layout.Content>
	);
}

DashboardStats.propTypes = {
	style: PropTypes.object,
	user: PropTypes.object.isRequired,
};

DashboardStats.defaultProps = {
	style: {},	
};

export default DashboardStats;