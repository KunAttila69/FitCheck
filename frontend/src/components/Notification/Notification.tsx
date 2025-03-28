import { useNavigate } from "react-router-dom";
import styles from "./Notification.module.css";
import { BASE_URL } from "../../services/interceptor";
import { useEffect, useState } from "react";

interface NotificationProps {
  notif: {
    id: number;
    actorProfilePictureUrl: string | null;
    actorUsername: string;
    type: number;
    postThumbnailUrl: string | null;
  };
}

const Notification = ({ notif }: NotificationProps) => {
  const navigate = useNavigate();
  const [notifMessage, setNotifMessage] = useState("");

  useEffect(() => {
    switch (notif.type) {
      case 0:
        setNotifMessage("Liked your post");
        break;
      case 1:
        setNotifMessage("Followed you");
        break;
      case 2:
        setNotifMessage("Commented under your post");
        break;
      default:
        setNotifMessage("");
    }
  }, [notif]);

  return (
    <div className={styles.notification} onClick={() => navigate(`/post/${notif.id}`)}>
      <img
        src={notif.actorProfilePictureUrl ? BASE_URL + notif.actorProfilePictureUrl : "/images/FitCheck-logo.png"}
        alt="User Profile"
        className={styles.actorProfilePic}
      />
      <div className={styles.textContainer}>
        <h4>{notif.actorUsername}</h4>
        <p>{notifMessage}</p>
      </div>
      {notif.postThumbnailUrl && (
        <img
          src={BASE_URL + notif.postThumbnailUrl}
          alt="Post Thumbnail"
          className={styles.postThumbnail}
        />
      )}
    </div>
  );
};

export default Notification;
