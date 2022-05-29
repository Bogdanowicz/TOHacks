const funcs = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');

const app = express();
const USER_TAB = 'users';

admin.initializeApp();

const db = admin.firestore();

app.get('/ping', (requ, resp) => { 
    const token = requ.body.idToken;

    console.log(token);
    admin.auth().verifyIdToken(token)
        .then((decodedToken) => {
            const uid = decodedToken.uid;
            return admin.auth().getUser(uid)
        })
        .then((user) => {
            return resp.status(201).json({ message: `${user.email}` });
        })
        .catch(e => {
            console.error(e);
            return resp.status(500).json({ message: 'INTERNAL SERVER ERROR' });
        });
});

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

app.post('/createUser', (requ, resp) => {
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

app.post('/signup', (requ, resp) => {
    const newUser = {
        email: requ.body.email,
        password: requ.body.password,
        confirmPassword: requ.body.confirmPassword,
        handle: requ.body.handle,
    };

    if (newUser.email == undefined || newUser.password == undefined 
        || newUser.confirmPassword !== newUser.password || newUser.handle == undefined) {
        return resp.status(400).json({ handle: "BAD NEW USER INFO" });
    }
    console.log(newUser)

    db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                return resp.status(400).json({ handle: "HANDLE ALREADY TAKEN" });
            } else {
                return admin.auth().createUser(newUser);
            }
        })
        .then(data => {
            return resp.status(201).json({ message: 'CREATED USER' });
        })
        .catch(e => {
            console.error(e);
            return resp.status(500).json({ message: 'INTERNAL SERVER ERROR' });
        })
});

exports.api = funcs.https.onRequest(app);
