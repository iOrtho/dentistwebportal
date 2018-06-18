import React from 'react';
import { Layout, Menu } from 'antd';
import PropTypes from 'prop-types';

const Navbar = ({navigate,current, style: customStyle}) => {
	
	return (
		<Layout.Header className="header">
			<div className="logo" />
		    <Menu
		        theme="dark"
		        mode="horizontal"
		        defaultSelectedKeys={[current]}
		        style={{ lineHeight: '64px' }}
		    >
		        <Menu.Item key="/home" onClick={() => navigate('/home')}>Home</Menu.Item>
		        <Menu.Item key="/profile" onClick={() => navigate('/profile')}>My Profile</Menu.Item>
		        <Menu.Item key="/office-details" onClick={() => navigate('/office-details')}>Office Details</Menu.Item>
		    </Menu>
		</Layout.Header>
	);
}

Navbar.propTypes = {
	navigate: PropTypes.func.isRequired,
	current: PropTypes.string.isRequired,
	style: PropTypes.object,
};

Navbar.defaultProps = {
	style: {},
};

export default Navbar;