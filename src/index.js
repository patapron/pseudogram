import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

firebase.initializeApp({
    apiKey: "AIzaSyCqoov6WgebMj-lobJ1kb6Te87QQrhb9Ac",
    authDomain: "pseudogram-965f0.firebaseapp.com",
    databaseURL: "https://pseudogram-965f0.firebaseio.com",
    projectId: "pseudogram-965f0",
    storageBucket: "pseudogram-965f0.appspot.com",
    messagingSenderId: "586434707157"
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
