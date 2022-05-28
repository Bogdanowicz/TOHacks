const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

//try to fetch the donation posts 
exports.getdonation = functions.https.onRequest((request, response) => {
    admin.firestore().collection('donations').get()
        .then(data => {
            let donations = [];
            data.forEach(doc => {
                donations.push(doc.data());
            });
            return response.json(donations);
        })
        .catch(err => console.error(err))
});
//create a donation
exports.createdonation = functions.https.onRequest((request, response) => {
    const newdonation = {
        body: request.body.body,
        userHandle: request.body.userHandle,
        organization: request.body.organization,
        address: request.body.address,
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
    };

    admin.firestore()
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