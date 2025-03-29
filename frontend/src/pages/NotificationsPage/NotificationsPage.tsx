import { useEffect, useState } from "react"; 
import Navbar from "../../components/Navbar/Navbar"; 
import Notification from "../../components/Notification/Notification";
import { getNotifications, markNotifications } from "../../services/authServices";
import LeaderboardComponent from "../../components/LeaderboardComponent/LeaderboardComponent";
import styles from "./NotificationsPage.module.css"
import FollowingComponent from "../../components/FollowingComponent/FollowingComponent";

const NotificationsPage = () => { 
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();  
        const unreadNotifications = data.notifications.filter((notif: any) => !notif.isRead);
        setNotifications(unreadNotifications); 
    
        
        if (unreadNotifications.length > 0) {
          await markNotifications(unreadNotifications);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
  
    fetchNotifications();
  }, []);

  return (
    <>
      <Navbar selectedPage="notifications"/>
      <main className={styles.notificationPageMain}>
        <div className={styles.leaderBoardContainer}>
          <LeaderboardComponent/>
        </div>
        <div className={styles.notificationsContainer}>
          {notifications.length > 0 ? (notifications.map((notif, i) => (
            <Notification notif={notif} key={i} />
          )))
          :
          (
            <p>No new notifications.</p>
          )
          }
        </div>
        <div className={styles.followingContainer}>
          <FollowingComponent/>
        </div>
      </main>
    </>
  );
};

export default NotificationsPage;
