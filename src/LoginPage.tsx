function LoginPage() {

  const navigateToAuthorize = async () => {
    const response = await fetch("/api/auth/discord");
    const data = await response.json() as { authorizeUri: string };
    window.location.href = data.authorizeUri;
  };

  return (
    <>
      <h1>Login</h1>
      <div className="card">
        <button onClick={() => navigateToAuthorize()}>
          Navigate to authorize
        </button>
      </div>
    </>
  )
}

export default LoginPage;
