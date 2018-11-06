const Functions = require('firebase-functions');
const Admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const { Expo } = require('expo-server-sdk');

const config = {
    apiKey: 'AIzaSyCSlKkhihmDZy9nJbFe7hBKlFR9i_RMVwk',
    authDomain: 'doctorapp-9c43b.firebaseapp.com',
    databaseURL: 'https://doctorapp-9c43b.firebaseio.com',
    projectId: 'doctorapp-9c43b',
    storageBucket: 'gs://doctorapp-9c43b.appspot.com',
    messagingSenderId: '249046440701',
};

Admin.initializeApp(config);

exports.sendNotification = Functions.https.onRequest((req, res) => {
    cors(req, res, () => {});
    
    const {expoTokenId} = req.body;
    const ExpoSDK = new Expo();

    if (!Expo.isExpoPushToken(expoTokenId)) {
        return res.status(400).json({
            success: false,
            message: 'The user\'s device ID is not valid.',
        });
    }

    const message = [{
        to: expoTokenId,
        sound: 'default',
        body: 'You have received a new message!',
        data: { target: 'chat' },
    }];

    return ExpoSDK.sendPushNotificationsAsync(message)
            .then(data => {
                return res.json({success: true});
            })
            .catch(console.error);
});