/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import {defineString} from "firebase-functions/params";
import {AppSecretConfigHandler} from "./secretConfig";
// import * as logger from "firebase-functions/logger";

const region = "asia-northeast1";
const host = defineString("APP_HOST");

// APP_SECRET_CONFIG を取得して保持する
const appSecretConfig = new AppSecretConfigHandler();

// noinspection JSUnusedGlobalSymbols
export const httpHandler = onRequest({
  region,
  secrets: ["APP_SECRET_CONFIG"], // Secret Manager から取得するシークレットのリスト
}, async (request, response) => {
  const path = request.path;

  // const redirectUri = `https://${host}/auth/discord/completion`;

  logger.info(`Request path: https://${host}${path}`);

  response.send({
    message: "Hello from Firebase!",
    host: host.value(),
    path,
    headers: request.headers,
    env: process.env,
    isFirebaseCli: process.env.FUNCTIONS_EMULATOR === "true",
    discordClientId: appSecretConfig.get().discordClientId, // 例としてClient IDを返す
  });
});
