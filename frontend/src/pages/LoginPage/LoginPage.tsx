import { useState } from "react"
import "./LoginStyle.css"
import { loginUser } from "../../services/authServices"

const LoginPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const submitLoginForm = (e: React.FormEvent) => {
    e.preventDefault()
    loginUser(username, password).then(res => {
      console.log(res)
    })
  }

  return (
    <div className="login-container">
        <div className="form-container">
            <h1>Login</h1>
            <form onSubmit={submitLoginForm}>
                <input type="text" value={username} placeholder="Username or email address" onChange={e => setUsername(e.target.value)}/>
                <input type="password" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)}/>
                <input type="submit" value={"Log in"}/>
            </form>
            <a href="#">Forgotten your password?</a>
        </div>
        <div className="reroute-container">
            <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </div>
    </div>
  )
}

export default LoginPage