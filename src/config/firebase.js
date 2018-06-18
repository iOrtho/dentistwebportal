import firebase from 'firebase';
import 'firebase/firestore';

const config = {
	apiKey: 'AIzaSyCSlKkhihmDZy9nJbFe7hBKlFR9i_RMVwk',
    authDomain: 'doctorapp-9c43b.firebaseapp.com',
    databaseURL: 'https://doctorapp-9c43b.firebaseio.com',
    projectId: 'doctorapp-9c43b',
    storageBucket: '',
    messagingSenderId: '249046440701',
};

const settings = {
	timestampsInSnapshots: true,
};

firebase.initializeApp(config);

const firestore = firebase.firestore();
firestore.settings(settings);

export const database = firestore;
export const auth = firebase.auth();
export default firebase;