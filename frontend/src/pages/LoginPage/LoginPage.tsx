import { useState } from "react"
import styles from "./LoginStyle.module.css";
import { loginUser } from "../../services/authServices" 

interface LoginProps{
  fetchProfile: () => Promise<void>;
}

const LoginPage = ({fetchProfile}:LoginProps) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false) 

  const submitLoginForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    if (!username || !password) {
      setError("Username and password are required!");
      return;
    }
  
    setLoading(true);
    try {
      const res = await loginUser(username, password);
      if (res && res.status === 200) {
        console.log("Login successful!", res);
        fetchProfile()
        window.location.href = "/"
      } else {
        setError("Invalid username or password!");
      }
    } catch (err) {
      setError("Invalid username or password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {error && <div className={styles.error}>
        <p>{error}</p>
        <button onClick={() => {setError(null)}}>X</button>
      </div>}
      <h1>Welcome to FitCheck</h1>
        <div className={styles.formContainer}>
            <h1>Login</h1>
            <form onSubmit={submitLoginForm}>
                <label>Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)}/>
                <label>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
                <input type="submit" value={loading ? "Logging in..." : "Login"} disabled={loading} />
              <p>Don't have an account? <a href="/signup">Sign up</a></p>
            </form> 
        </div> 
    </div>
  )
}

export default LoginPage