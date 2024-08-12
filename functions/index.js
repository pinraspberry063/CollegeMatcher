/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Import the functions module
const functions = require("firebase-functions");

// Initialize the admin SDK
const admin = require("firebase-admin");
admin.initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Add our new function to revoke user tokens
exports.revokeUserTokens = functions.firestore
  .document('Users/{userId}')
  .onUpdate((change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();

    if (newValue.status === 'banned' && previousValue.status !== 'banned') {
      return admin.auth().revokeRefreshTokens(context.params.userId)
        .then(() => {
          logger.info('Tokens revoked for user', context.params.userId);
          return null;
        })
        .catch(error => {
          logger.error('Error revoking tokens:', error);
        });
    }
    return null;
  });