import { useNavigate } from "react-router-dom";
import styles from "./Notification.module.css"

interface NotificationProps{
    notif: {
        userPic: string,
        user: string,
        actionType: number,
        post: string | null,
    }
}

const Notification = ({notif}: NotificationProps) => {
    const navigate = useNavigate()
    return ( 
        <div className={styles.notification}>
            <img src={notif.userPic}  onClick={() => {navigate("/profile")}}/>
            <div className={styles.textContainer}>
                <h4>{notif.user}</h4>
                <p>{notif.actionType == 1 ? "Liked your post" : "Sent you a friend request"}</p>
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
    );
}
 
export default Notification;