import { BASE_URL } from "../../services/interceptor";
import styles from "./Friend.module.css"
import { useNavigate } from "react-router-dom";

interface FriendProps{
    friend: {
        profilePictureUrl: string,
        username: string,
        newPosts: number,
    }
}

const Friend = ({friend} : FriendProps) => {
    const navigate = useNavigate() 
    console.log(friend)
    return ( 
        <div className={styles.friendContainer}>
            <img src={friend.profilePictureUrl == null ? "../../src/images/FitCheck-logo.png" : BASE_URL + friend.profilePictureUrl}  onClick={() => {navigate("/profile/"+friend.username)}}/>
            <div className={styles.textContainer}>
                <h4>{friend.username}</h4>
                <p>This user has {friend.newPosts} new posts</p>
            </div>
            <button className={styles.deleteFriend}></button>
        </div>
    );
}
 
export default Friend;