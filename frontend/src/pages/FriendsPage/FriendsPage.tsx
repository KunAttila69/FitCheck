import {  useState } from "react";
import styles from "./FriendsPage.module.css"; 
import Navbar from "../../components/Navbar/Navbar";
import Friend from "../../components/Friend/Friend";

const FriendsPage = () => {
    const [profile, setProfile] = useState() 
    const notifications = [
      {user: "Gipsz Jakab", userPic: "../../images/img.png", newPosts: 4},
      {user: "Beton Jakab", userPic: "../../images/img.png", newPosts: 2}
    ]
  
    return (
      <>
        <Navbar selectedPage="friends"/>
        <main>
          {notifications.map((friend, i) => {
              return <Friend friend={friend} key={i}/>
          })}
        </main>
      </>
    )
  }
  
  export default FriendsPage