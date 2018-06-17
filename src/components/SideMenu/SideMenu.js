import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import PropTypes from 'prop-types';
import { database } from 'config/firebase';

const SideMenu = ({conversations, onOpenConvo, onOpenHome, style: customStyle}) => {

	return (
		<Layout.Sider style={{...customStyle}}>
			<Menu
				mode="inline"
				defaultSelectedKeys={['1']}
				style={{ height: '100%', borderRight: 0 }}
			>
			<Menu.Item key="1" onClick={onOpenHome}><Icon type="home" /> Dashboard</Menu.Item>
				{(() => {
					const convId = Object.keys(conversations);

					if(convId.length > 0) {
						return (
							<Menu.SubMenu key="sub1" title={<span><Icon type="user" />Conversations</span>}>
								{convId.map(id => {
									const convo = conversations[id];

									return (
										<Menu.Item 
											key={id}
											onClick={() => onOpenConvo(id)}
											>{convo.name}</Menu.Item>
									);
								})}
      						</Menu.SubMenu>
						);
					}else {
						return (
							<Menu.ItemGroup key="99" title="No conversations were found." />
						);
					}
				})()}
			</Menu>
		</Layout.Sider>
	);
}

SideMenu.propTypes = {
	conversations: PropTypes.object.isRequired,
	onOpenConvo: PropTypes.func.isRequired,
	onOpenHome: PropTypes.func.isRequired,
};

SideMenu.defaultProps = {
	style: {},
};

export default SideMenu;