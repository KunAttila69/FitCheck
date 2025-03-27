import { useNavigate } from "react-router-dom";
import styles from "./Notification.module.css";
import { BASE_URL } from "../../services/interceptor";

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

  return (
    <div className={styles.notification}>
      <img
        src={notif.actorProfilePictureUrl == null ? "/images/FitCheck-logo.png" : BASE_URL + notif.actorProfilePictureUrl}
        alt="User Profile"
        className={styles.actorProfilePic}
        onClick={() => navigate(`/profile/${notif.actorUsername}`)}
      />
      <div className={styles.textContainer}>
        <h4>{notif.actorUsername}</h4>
        <p>{notif.type === 0 ? "Liked your post" : "Sent you a friend request"}</p>
      </div>
      {notif.postThumbnailUrl && (
        <img
          src={BASE_URL + notif.postThumbnailUrl}
          alt="Post Thumbnail"
          className={styles.postThumbnail}
          onClick={() => navigate(`/post/${notif.id}`)}
        />
      )} 
    </div>
  );
};

export default Notification;
