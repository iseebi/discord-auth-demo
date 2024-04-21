import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {initializeApp} from "firebase/app";
import {connectAuthEmulator, getAuth} from "firebase/auth";

fetch('/__/firebase/init.json').then(async response => {
  const config = await response.json()
  initializeApp(config);
  if (import.meta.env.DEV) {
    const auth = getAuth();
    connectAuthEmulator(auth, 'http://localhost:9099');
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
});

