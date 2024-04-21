import {getAuth, signOut} from "firebase/auth";

function TopPage() {

  const logout = async () => {
    await signOut(getAuth());
  };

  return (
    <>
      <h1>Top Page</h1>
      <div className="card">
        <button onClick={() => logout()}>
          Logout
        </button>
      </div>
    </>
  )
}

export default TopPage;
