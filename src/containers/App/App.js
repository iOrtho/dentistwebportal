import React, { Component } from 'react';
import { Layout } from 'antd';
import Navbar from 'components/Navbar';
import './style.css';

class App extends Component {

	/**
	 * Render the component's markup
	 * @return {ReactElement} 
	 */
	render() {
		return (
			<Layout style={{height: '100vh'}}>
				{this.props.children}
			</Layout>
		);
	}
}

export default App;
