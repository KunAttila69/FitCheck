import { useEffect, useState } from "react";
import "./HomePageStyle.module.css";
import { getUserProfile } from "../../services/authServices"
import Post from "../../components/Post/Post";
import Navbar from "../../components/Navbar/Navbar";

const HomePage = () => { 
  const [profile, setProfile] = useState() 
  
  useEffect(()=> {
    getUserProfile()
      .then(res => {
        console.log(res)
        setProfile(res)
      })
  }, [])

  return (
    <>
      <Navbar selectedPage="home"/>
      <main>
        <Post/>
        <Post/>
        <Post/>
        <Post/>
        <Post/>
      </main>
    </>
  )
}

export default HomePage