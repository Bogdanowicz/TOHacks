const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();

const express = require('express');
const app = express();

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
        .catch(err => console.error(err))
});

//create a donation
app.post('/donation', (request, response) => {
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

// https://baseurl.com/api/

exports.api = functions.https.onRequest(app);