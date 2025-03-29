import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../services/interceptor";
import { getNotifications } from "../../services/authServices";

interface NavbarProps {
    selectedPage: string;
    profilePic: null | string;
}

const Navbar = ({ selectedPage, profilePic }: NavbarProps) => {
    const [notificationCount, setNotificationCount] = useState(0);
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate(); 

    const handleSearch = () => {
        if (searchText.trim() !== "") {
            navigate("/profile/" + searchText);
        }
    };

    
      useEffect(() => {
        const fetchNotifications = async () => {
          try {
            const data = await getNotifications();  
            setNotificationCount(data.unreadCount);
          } catch (err) {
            console.error("Error fetching notifications:", err);
          }
        };
    
        fetchNotifications();
      }, []);

    return (
        <nav className={styles.navbar}>
            <div className={styles.searchRow}>
                <div className={styles.search}>
                    <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search for user"
                    />
                    <button onClick={handleSearch} />
                </div> 
                <img
                    className={styles.profile}
                    src={profilePic ? BASE_URL + profilePic : "images/FitCheck-logo.png"}
                    alt="Profile"
                    onClick={() => navigate("/edit")}
                />
            </div>

            <div className={styles.iconContainer}>
                <div className={`${styles.icon} ${styles.notifications}`} onClick={() => navigate("/notifications")}>
                    {notificationCount > 0 && <div className={styles.notificationCount}>{notificationCount}</div>}
                    {selectedPage === "notifications" && <div className={styles.selected} />}
                </div>
                <div className={`${styles.icon} ${styles.friends}`} onClick={() => navigate("/following")}>
                    {selectedPage === "following" && <div className={styles.selected} />}
                </div>
                <div className={`${styles.icon} ${styles.home}`} onClick={() => navigate("/")}>
                    {selectedPage === "home" && <div className={styles.selected} />}
                </div>
                <div className={`${styles.icon} ${styles.addPhoto}`} onClick={() => navigate("/upload")}>
                    {selectedPage === "post" && <div className={styles.selected} />}
                </div>
                <div className={`${styles.icon} ${styles.leaderboard}`} onClick={() => navigate("/leaderBoard")}>
                    {selectedPage === "leaderboard" && <div className={styles.selected} />}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
