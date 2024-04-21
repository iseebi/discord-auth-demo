import {useEffect, useState} from 'react'
import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import LoginPage from "./LoginPage.tsx";
import TopPage from "./TopPage.tsx";
import LoginCompletionHandlePage from "./LoginCompletionHandlePage.tsx";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() =>
    onAuthStateChanged(getAuth(), (user) => {
      setLoggedIn(Boolean(user));
    })
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/discord/completion" element={<LoginCompletionHandlePage method="discord" />} />
        {loggedIn ? (
          <Route path="/" element={<TopPage />} />
        ) : (
          <Route path="/" element={<LoginPage />} />
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default App
