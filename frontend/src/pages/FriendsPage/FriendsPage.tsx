import {  useState } from "react";
import styles from "./FriendsPage.module.css"; 
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

const FriendsPage = () => {
    const navigate = useNavigate() 
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
              return (
                  <div className={styles.friendContainer} key={i}>
                      <img src={friend.userPic}  onClick={() => {navigate("/profile")}}/>
                      <div className={styles.textContainer}>
                          <h4>{friend.user}</h4>
                          <p>This user has {friend.newPosts} new posts</p>
                      </div>
                      <button className={styles.deleteFriend}></button>
                  </div>
              )
          })}
        </main>
      </>
    )
  }
  
  export default FriendsPage