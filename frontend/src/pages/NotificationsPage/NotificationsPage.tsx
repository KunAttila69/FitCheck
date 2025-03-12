import { useEffect, useState } from "react";
import styles from "./NotificationsPage.module.css";
import { getUserProfile } from "../../services/authServices" 
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
const NotificationsPage = () => {
  const navigate = useNavigate() 
  const [profile, setProfile] = useState() 
  const notifications = [
    {user: "Gipsz Jakab", userPic: "../../images/img.png", action: "Liked your post", actionType: 1, post: "../../images/img.png"},
    {user: "Beton Jakab", userPic: "../../images/img.png", action: "Sent you a friend request", actionType: 2, post: null}
  ]

  return (
    <>
      <Navbar selectedPage="notifications"/>
      <main>
        {notifications.map((notif, i) => {
            return (
                <div className={styles.notification} key={i}>
                    <img src={notif.userPic}  onClick={() => {navigate("/profile")}}/>
                    <div className={styles.textContainer}>
                        <h4>{notif.user}</h4>
                        <p>{notif.action}</p>
                    </div>
                    <div className={styles.reactionContainer}>
                        {notif.actionType == 1 ? 
                        (
                            <img src={notif.post ? notif.post : ""} />
                        ):
                        (
                            <>
                                <button className={styles.acceptBtn}>Accept</button>
                                <button className={styles.declineBtn}>X</button>
                            </>
                        )
                        }
                    </div>
                </div>
            )
        })}
      </main>
    </>
  )
}

export default NotificationsPage