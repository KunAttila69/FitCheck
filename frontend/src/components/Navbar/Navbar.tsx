import { useState } from "react";
import styles from "./Navbar.module.css";
import {useNavigate} from "react-router-dom"
import { BASE_URL } from "../../services/interceptor";
interface NavbarProps{
    selectedPage: string,
    profilePic: null | string
}

const Navbar = ({selectedPage, profilePic} : NavbarProps) => {
    const [notificationCount, setNotificationCount] = useState(2)
    const navigate = useNavigate()
    return ( 
        <nav>
            <div className={styles.searchRow}>
                <div className={styles.search}>
                    <button></button>
                    <input type="text" placeholder="Search for user"/>
                </div>
                <img className={styles.profile} src={profilePic != null ? BASE_URL + profilePic : "../../src/images/FitCheck-logo.png"} onClick={() => {navigate("/edit")}}/>
            </div>
                <div className={styles.iconContainer}>
                <div className={`${styles.notifications} ${styles.icon}`} onClick={() => navigate("/notifications")}>{notificationCount > 0 ? <div className={styles.notificationCount}>{notificationCount}</div> : ""} {selectedPage == "notifications" ? <div className={styles.selected}/> : ""}</div>
                <div className={`${styles.friends} ${styles.icon}`} onClick={() => navigate("/friends")}>{selectedPage == "friends" ? <div className={styles.selected}/> : ""}</div>
                <div className={`${styles.home} ${styles.icon}`} onClick={() => navigate("/")}>{selectedPage == "home" ? <div className={styles.selected}/> : ""}</div>
                <div className={`${styles.addPhoto} ${styles.icon}`} onClick={() => navigate("/upload")}>{selectedPage == "post" ? <div className={styles.selected}/> : ""}</div>
                <div className={`${styles.leaderboard} ${styles.icon}`} onClick={() => navigate("/leaderBoard")}>{selectedPage == "leaderboard" ? <div className={styles.selected}/> : ""}</div>
            </div>
      </nav>  
    );
}
 
export default Navbar;