import React, { Component } from 'react';
import { Layout } from 'antd';
import Navbar from 'components/Navbar';

class DashboardWrapper extends Component {

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
			state: 99
		};
	}

	/**
	 * Render the component's markup
	 * @return {ReactElement} 
	 */
	render() {
		const {history, location} = this.props;

		return (
			<div>
				<Navbar current={location.pathname} navigate={(route) => history.push(route)} />
				{this.props.children}
				<Layout.Footer style={{textAlign: 'center'}}>
					&copy; Copyright {(new Date()).getFullYear()} - All Rights Reserved.
				</Layout.Footer>
			</div>
		);
	}
}

export default DashboardWrapper;