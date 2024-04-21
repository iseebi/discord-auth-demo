import { getAuth, signInWithCustomToken } from "firebase/auth";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

const runningCompletion: Record<string, boolean> = {};

const handleLoginCompletion = async (method: string, code: string | null, navigate: (path: string) => void) => {
  if (runningCompletion[method]) return;
  runningCompletion[method] = true;

  if (!code) {
    console.error("No code provided");
    runningCompletion[method] = false;
    navigate('/');
    return;
  }

  const response = await fetch(`/api/auth/${method}/completion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({code}),
  });
  const resultJson = (await response.json()) as { token: string };
  const auth = getAuth();
  const result = await signInWithCustomToken(auth, resultJson.token);
  console.log(result);
  runningCompletion[method] = false;
  navigate('/');
};


function LoginCompletionHandlePage({ method }: { method: string }) {
  const navigate = useNavigate();

  // onMount Handling
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    handleLoginCompletion(method, code, navigate).then();
  }, [method, navigate]);

  return (
    <>
      <div>Processing...</div>
    </>
  )
}

export default LoginCompletionHandlePage;
