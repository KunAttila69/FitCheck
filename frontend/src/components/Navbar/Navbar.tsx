import { useState } from "react";
import styles from "./Navbar.module.css";
import {useNavigate} from "react-router-dom"
interface NavbarProps{
    selectedPage: string
}

const Navbar = ({selectedPage} : NavbarProps) => {
    const [notificationCount, setNotificationCount] = useState(2)
    const navigate = useNavigate()
    return ( 
        <nav>
            <div className={styles.searchRow}>
                <div className={styles.search}>
                    <button></button>
                    <input type="text" placeholder="Search for user"/>
                </div>
                <div className={styles.profile}></div>
            </div>
                <div className={styles.iconContainer}>
                <div className={`${styles.notifications} ${styles.icon}`} onClick={() => navigate("/notifications")}>{notificationCount > 0 ? <div className={styles.notificationCount}>{notificationCount}</div> : ""} {selectedPage == "notifications" ? <div className={styles.selected}/> : ""}</div>
                <div className={`${styles.friends} ${styles.icon}`} onClick={() => navigate("/friends")}>{selectedPage == "friends" ? <div className={styles.selected}/> : ""}</div>
                <div className={`${styles.home} ${styles.icon}`} onClick={() => navigate("/")}>{selectedPage == "home" ? <div className={styles.selected}/> : ""}</div>
                <div className={`${styles.addPhoto} ${styles.icon}`} onClick={() => navigate("/addPost")}>{selectedPage == "post" ? <div className={styles.selected}/> : ""}</div>
                <div className={`${styles.leaderboard} ${styles.icon}`} onClick={() => navigate("/leaderBoard")}>{selectedPage == "leaderboard" ? <div className={styles.selected}/> : ""}</div>
            </div>
      </nav>  
    );
}
 
export default Navbar;