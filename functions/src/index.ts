/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

const region = "asia-northeast1";

// noinspection JSUnusedGlobalSymbols
export const httpHandler = onRequest({region}, async (request, response) => {
  response.send({message: "Hello from Firebase!"});
});
