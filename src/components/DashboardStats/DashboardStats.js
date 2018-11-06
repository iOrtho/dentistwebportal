import React from 'react';
import { Layout } from 'antd';
import PropTypes from 'prop-types';

const DashboardStats = ({user, style: customStyle}) => {
	const style = { background: '#fff', padding: 24, margin: 0, minHeight: 280 };

	return (
		<Layout.Content style={{...style,...customStyle}}>
			Hey {user.firstname}, Welcome to the dashboard of <b>{user.Office.name}</b>.
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