import { useEffect, useState } from "react";
import styles from "./ProfilePage.module.css";
import { getUserProfile } from "../../services/authServices"
import Post from "../../components/Post/Post";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => { 
  const [profile, setProfile] = useState() 
  const navigate = useNavigate()
  return (
    <> 
        <nav>
            <div className={styles.profileHeader}>
                <img src="../../images/img.png" className={styles.profilePic}/>
                <div>
                    <h3>gipsz.Jakab</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Explicabo, qui eius. Voluptates nesciunt debitis temporibus nihil laudantium officiis consequuntur dignissimos magni. Accusamus impedit asperiores saepe aliquam voluptatem libero, repellat magni.</p>
                </div>
                <div className={styles.buttonContainer}>

                    <div className={`${styles.home} ${styles.icon}`} onClick={() => navigate("/")}></div>
                </div>
            </div>
            <div className={styles.profileStats}>
                <div className={styles.friendsContainer}>
                    <h5>Friends</h5>
                    <h2>42</h2>
                </div>
                <div className={styles.likesContainer}>
                    <h5>Likes</h5>
                    <h2>42312</h2>
                </div>
                <div className={styles.postCountContainer}>
                    <h5>Posts</h5>
                    <h2>42132</h2>
                </div>
            </div>
            <button className={styles.addFriend}>Add Friend</button>
        </nav>
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

export default ProfilePage