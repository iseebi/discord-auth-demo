import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as fs from 'fs';

const firebaseRc = JSON.parse(fs.readFileSync(".firebaserc", "utf-8")) as { projects: { default: string } };
const projectId = firebaseRc.projects.default;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',  // IPv4での起動を強制する
    port: 6200, // ポートがずれるとOAuthの設定が手間になるので、起動ポートも固定しておく
    https: {
      key: fs.readFileSync("certs/key.pem"),
      cert: fs.readFileSync("certs/cert.pem"),
    },
    proxy: {
      "/__": {
        target: 'http://127.0.0.1:5100/',
        changeOrigin: true,
        secure: false,
      },
      "/api": {
        target: `http://127.0.0.1:5100/`,
        changeOrigin: true,
        secure: false,
      }
    }
  },
})
