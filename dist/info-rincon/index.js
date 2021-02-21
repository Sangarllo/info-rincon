const functions = require('firebase-functions');

// Increase readability in Cloud Logging
require("firebase-functions/lib/logger/compat");

const expressApp = require('./dist/info-rincon/server/main').app();

exports.ssr = functions
    .region('europe-west1') // us-central1
    .runWith({ "memory": "1GB", "timeoutSeconds": 540 })
    .https
    .onRequest(expressApp);