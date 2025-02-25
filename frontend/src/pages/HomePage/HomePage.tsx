import { useEffect, useState } from "react"
import "./style.css"  
import { getUserProfile } from "../../services/authServices"

const HomePage = () => { 
  const [profile, setProfile] = useState()
  
  useEffect(()=> {
    getUserProfile().then(res => {
      setProfile(res)
    })
  }, [])
  
  return (
    <>
      <nav>
        <div className="search">
          <button></button>
          <input type="text" placeholder="Search for user"/>
        </div>
        <div className="profile"></div>
      </nav>
      <main></main>
      <main>
        <h1>Logged in as: {profile}</h1>
      </main>
    </>
  )
}

export default HomePage