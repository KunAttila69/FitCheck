import { useEffect, useState } from "react";
import "./HomePageStyle.module.css";
import { getUserProfile } from "../../services/authServices"
import Post from "../../components/Post/Post";
import Navbar from "../../components/Navbar/Navbar";

interface PageProps{
  fetchProfile: () => void
}

const HomePage = ({fetchProfile}:PageProps) => { 
  useEffect(() => { 
    fetchProfile();
  }, []);

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