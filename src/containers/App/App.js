import React, { Component } from 'react';
import { Layout } from 'antd';
import Navbar from 'components/Navbar';
import { connect } from 'react-redux';
import { auth, database } from 'config/firebase';
import UserAction from 'store/actions/user';
import OfficeAction from 'store/actions/office';
import store from 'store/store';
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
        const {id} = store.getState().office;
        const Offices = database.collection('Offices');
         Offices.doc(id).onSnapshot(doc => {
        	store.dispatch(OfficeAction.setOfficeModel({
                ...doc.data(),
                ready: true,
            }));
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
                        store.dispatch(UserAction.resetUserModel());
                        store.dispatch(UserAction.setUserModel(data));
                    });
                });
             }else {
                store.dispatch(UserAction.resetUserModel());
                store.dispatch(UserAction.setAuthCheckStatus(true));
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

export default App;
