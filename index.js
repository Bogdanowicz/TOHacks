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