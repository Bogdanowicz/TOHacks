const funcs = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');

const app = express();
const USER_TAB = 'users';

admin.initializeApp();

const db = admin.firestore();

app.get('/ping', (requ, resp) => { resp.send('Hello World'); });
//try to fetch the donation posts 
app.get('/donations', (request, response) => {
    admin
        .firestore()
        .collection('donations')
        .orderBy('createdAt','desc') //orders the donations by most recent 
        .get()
        .then(data => {
            let donations = [];
            data.forEach(doc => {
                donations.push({
                    donationId: doc.id,
                    body: doc.data().body, //body of message
                    organization: doc.data().organization, //organization name
                    address: doc.data().address, //address of organization
                    userHandle: doc.data().userHandle, //username of poster
                    createdAt: doc.data().createdAt //time posted
                });
            });
            return response.json(donations);
        })
        .catch(err => {
            console.error(err)
            response.status(500).json({error: 'An error has occured'});
        });
        
});

//create a donation
app.post('/donation', (request, response) => {
    if (request.body.body.trim() === '') {
        return response.status(400).json({error: 'Body cannot be'});
    }
    const newdonation = {
        body: request.body.body,
        userHandle: request.body.userHandle,
        organization: request.body.organization,
        address: request.body.address,
        createdAt: admin.firestore.Timestamp.fromDate(new Date()) 
    };

    admin
        .firestore()
        .collection('donations')
        .add(newdonation)
        .then(doc => {
            response.json({message:`document ${doc.id} created successfully`});
        })
        .catch(err => {
            response.status(500).json({error: 'An error has occured'});
            console.error(err);
        })
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
