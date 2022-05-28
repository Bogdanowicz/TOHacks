// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const cfg = require('./config');

const funcs = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');

const firebase = require('firebase');

// const firebase = require('./node_modules/firebase/app')
// const auth = require('./node_modules/firebase/auth')

// import { initializeApp } from 'firebase/app';
// import { getAuth, onAuthStateChanged, getRedirectResult } from 'firebase/auth';


const app = express();
const USER_TAB = 'users';

console.log(cfg.getFirebaseConfig());

admin.initializeApp();
firebase.initializeApp(cfg.getFirebaseConfig());
// initializeApp(cfg.getFirebaseConfig());

app.get('/ping', (requ, resp) => { resp.send('Hello World'); });

app.get('/getUser', (requ, resp) => {
    admin.firestore().collection(USER_TAB).get()
        .then(data => {
            let users = [];
            data.forEach(doc => {
                users.push(doc)
            });
            return resp.json(users); 
        })
        .catch(e => {
            console.log(e);
        });
});

app.get('/createUser', (requ, resp) => {
    if (requ.method !== 'POST')
        return resp.status(400).json({ error: "METHOD NOT ALLOWED" });
    const newUser = {
        body: requ.body.body,
        handle: requ.body.handle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    };
    console.log(newUser);
    admin.firestore().collection(USER_TAB).add(newUser)
        .then(doc => {
            resp.json({ message: `created ${doc.id}` })
        })
        .catch(e => {
            resp.status(500).json({ error: 'error' });
            console.error(e)
        });
});

app.get('/signup', (requ, resp) => {
    const newUser = {
        email: requ.body.email,
        password: requ.body.password,
        confirmPassword: requ.body.confirmPassword,
        handle: requ.body.handle,
    };
    firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => {
        return resp.status(201).json({message: `created user ${data.user.uid}`});
    })
    .catch(e => {
        console.error(e);
        return resp.status(500).json({ message: 'INTERNAL SERVER ERROR' });
    });
});

exports.api = funcs.https.onRequest(app);
