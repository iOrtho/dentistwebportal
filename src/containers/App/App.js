import React, { Component } from 'react';
import { Layout } from 'antd';
import Navbar from 'components/Navbar';
import { connect } from 'react-redux';
import { auth, database } from 'config/firebase';
import UserAction from 'store/actions/user';
import OfficeAction from 'store/actions/office';
import './style.css';

class App extends Component {

	/**
	 * Set listeners for all relevant data
	 */
	componentDidMount() {
		this.loadOfficeDetails();
		this.loadUserDetails();
	}

	/**
     * Set a listener on the office model and sync it to the store
     * @return {Void} 
     */
    loadOfficeDetails() {
        const {id} = this.props.office;
        const Offices = database.collection('Offices');

        Offices.doc(id).onSnapshot(doc => {
        	this.props.setOfficeModel({
                ...doc.data(),
                ready: true,
            });
        });
    }

    /**
     * Set a listener on the user model and sync it to the store
     * @return {Void} 
     */
    loadUserDetails() {
    	auth.onAuthStateChanged((user) => {
            if(user) {
            	database.collection('Users').where('auth_id', '==', user.uid)
            	.onSnapshot(snap => {
                    snap.docChanges().forEach(change => {
                        const data = {
                            ...change.doc.data(),
                            id: change.doc.id,
                            authCheckStatus: true,
                        };

                        this.props.resetUserModel();
                        this.props.setUserModel(data);
                    });
                });

            }else {
                this.props.resetUserModel();
                this.props.setAuthCheckStatus(true);
            }
        });
    }

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

export default connect(mapStateToProps, mapDispatchToProps)(App);

/**
 * Map the redux store's state to the component's props
 * @param  {Object} options.office The office model
 * @return {Object}                  
 */
function mapStateToProps({office}) {
	return {
		office,
	};
}

/**
 * Map the actions and dispatch of the store to the component's props
 * @param  {Function} dispatch The store's action dispatcher
 * @return {Object}          
 */
function mapDispatchToProps(dispatch) {
	return {
		setUserModel: (data) => dispatch(UserAction.setUserModel(data)),
		setAuthCheckStatus: () => dispatch(UserAction.setAuthCheckStatus()),
		setOfficeModel: (data) => dispatch(OfficeAction.setOfficeModel(data)),
	};
}