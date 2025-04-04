import { useState } from "react";
import styles from "./LoginStyle.module.css"; 
import Popup from "../../components/Popup/Popup";
import { useProfile } from "../../contexts/ProfileContext";
import { loginUser } from "../../services/authServices";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { profile } = useProfile()
 
  const submitLoginForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("Username and password are required!");
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser(username, password);
      if (response && response.status === 200) {
        console.log("Login successful!", response);
        profile?.fetchProfile();
        window.location.href = "/";
      } else if(response?.status !== 200){
        setError(response?.error || "");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {error && (
        <Popup message={error} type={1} reset={() => {setError(null)}}/>
      )}
      <h1>Welcome to FitCheck</h1>
      <div className={styles.formContainer}>
        <h1>Login</h1>
        <form onSubmit={submitLoginForm}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="submit"
            value={loading ? "Logging in..." : "Login"}
            disabled={loading}
          />
          <p>
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
