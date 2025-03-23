import { Link } from "react-router-dom";

function UnauthorizedPage() {
  return (
    <div className="unauthorized">
      <h1>You are not signed in</h1>
      <p>Please sign in to access the site.</p>
      <Link to="/login">
        <button>Go to Login</button>
      </Link>
    </div>
  );
}

export default UnauthorizedPage;
