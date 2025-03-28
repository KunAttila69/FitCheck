import { useState } from "react";
import styles from "./SignUpStyle.module.css"; 
import { registerUser } from "../../services/authServices";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required!");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await registerUser(username, email, password);
      if (response.status !== 200) {
        setError(response.error);
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.signupContainer}>
      {error && (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => setError(null)}>X</button>
        </div>
      )}
      <h1>Welcome to FitCheck</h1>
      <div className={styles.formContainer}>
        <h1>Registration</h1>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <label>Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <button type="submit">Sign Up</button>
          <p>Already have an account? <a href="/login">Log in</a></p> 
        </form>
      </div> 
    </div>
  );
};

export default SignUpPage;
