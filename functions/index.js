// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const funcs = require('firebase-functions');
const admin = require('firebase-admin')
const express = require('express');
const app = express();

admin.initializeApp();

const USER_TAB = 'users';

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

exports.api = funcs.https.onRequest(app);
