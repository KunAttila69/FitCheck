import { useEffect, useState } from "react"; 
import Navbar from "../../components/Navbar/Navbar"; 
import Notification from "../../components/Notification/Notification";
import { getNotifications } from "../../services/authServices";
  

interface PageProps {
  profile: any;
}

const NotificationsPage = ({ profile }: PageProps) => { 
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications(); 
        console.log(data)
        setNotifications(data.notifications);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <>
      <Navbar selectedPage="notifications" profilePic={profile.profilePictureUrl} />
      <main>
        {notifications.length > 0 && notifications.map((notif, i) => (
          <Notification notif={notif} key={i} />
        ))}
      </main>
    </>
  );
};

export default NotificationsPage;
