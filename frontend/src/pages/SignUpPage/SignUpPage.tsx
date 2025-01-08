import "./SignUpStyle.css"
const SignUpPage = () => {
  return (
    <div className="signup-container">
        <div className="form-container">
            <h1>Sign Up</h1>
            <form>
                <input type="text" placeholder="Email address"/>
                <input type="password" placeholder="Password"/>
                <input type="text" placeholder="Username"/>
                <input type="text" placeholder="Tag"/>
                <input type="submit" value={"Sign up"}/>
            </form>
        </div>
        <div className="reroute-container">
            <p>Already have an account? <a href="/login">Log in</a></p>
        </div>
    </div>
  )
}

export default SignUpPage