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
import * as admin from "firebase-admin";
import {AppSecretConfigHandler} from "./secretConfig";
// import * as logger from "firebase-functions/logger";

const region = "asia-northeast1";
const host = defineString("APP_HOST");
const requestScopes = ["identify", "guilds"];

// APP_SECRET_CONFIG を取得して保持する
const appSecretConfig = new AppSecretConfigHandler();

admin.initializeApp();

// noinspection JSUnusedGlobalSymbols
export const httpHandler = onRequest({
  region,
  secrets: ["APP_SECRET_CONFIG"], // Secret Manager から取得するシークレットのリスト
}, async (request, response) => {
  const path = request.path;

  const secretConfig = appSecretConfig.get();
  const redirectUri = `https://${host.value()}/auth/discord/completion`;

  switch (path) {
  case "/api/auth/discord": {
    const scopesString = requestScopes.join(" ");
    response.send({
      authorizeUri: "https://discord.com/api/oauth2/authorize?" +
          `client_id=${secretConfig.discordClientId}` +
          `&redirect_uri=${redirectUri}` +
          `&response_type=code&scope=${encodeURIComponent(scopesString)}`,
    });
    break;
  }
  case "/api/auth/discord/completion": {
    // code を得る
    const code = request.body.code;
    if (!code) {
      response.status(400).send("Bad Request");
      return;
    }

    // Discord からトークンを得る
    const authResult = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: secretConfig.discordClientId,
        client_secret: secretConfig.discordClientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });
    const authJson = await authResult.json() as {
        access_token: string,
        refresh_token: string,
        error?: string
      };
    if (authJson.error) {
      response.status(500).send(authJson.error);
      return;
    }
    const accessToken = authJson.access_token;
    // const refreshToken = authJson.refresh_token;

    // Discord からユーザー情報を得る
    const userResult = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userJson = await userResult.json() as {
        id: string,
        username: string,
      };

    // Firebase Authentication でカスタムトークンを発行する
    const token = await admin.auth().createCustomToken(
      `discord:${userJson.id}`,
      {
        "discord:id": userJson.id,
        "discord:username": userJson.username,
      });

    // TODO: 必要があれば、ここで accessToken/refreshToken を保存する

    response.send({token});
    break;
  }
  default:
    response.status(404).send("Not Found");
    break;
  }
});
