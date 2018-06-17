import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Breadcrumb, Menu, Icon } from 'antd';
import App from 'containers/App';
import Navbar from 'components/Navbar';
import SideMenu from 'components/SideMenu';
import { database } from 'config/firebase';

const companyId = 'ow71aFnAQgLAbQuF9KIQ';

class Chat extends Component {

	/** The component's constructor */
	constructor(props) {
		super(props);

		this.state = this.getInitialState();
	}

	/**
	 * Return the component's initial state
	 * @return {Object} 
	 */
	getInitialState() {
		return {
		};
	}


	/**
	 * Render the component's markup
	 * @return {ReactElement} 
	 */
	render() {
		return (
			<App>
				<Navbar />
				<Layout>
					<SideMenu />
					<Layout style={{ padding: '0 24px 24px' }}>
						<Breadcrumb style={{ margin: '16px 0' }}>
							<Breadcrumb.Item>Home</Breadcrumb.Item>
							<Breadcrumb.Item>Dashboard</Breadcrumb.Item>
						</Breadcrumb>
						<Layout.Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
							THIS IS A REAL CONVERSATION BRO!
						</Layout.Content>
	      			</Layout>
      			</Layout>
			</App>	
		);
	}
}

export default Chat;