import { useState } from "react";
import styles from "./SignUpStyle.module.css"; 

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
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
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
          <label>Email</label>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <label>Confirm password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
          <input type="submit" value="Sign up" />
          <p>Already have an account? <a href="/login">Log in</a></p> 
        </form>
      </div> 
    </div>
  );
};

export default SignUpPage