import styles from "./Friend.module.css"
import { useNavigate } from "react-router-dom";

interface FriendProps{
    friend: {
        userPic: string,
        user: string,
        newPosts: number,
    }
}

const Friend = ({friend} : FriendProps) => {
    const navigate = useNavigate() 
    return ( 
        <div className={styles.friendContainer}>
            <img src={friend.userPic}  onClick={() => {navigate("/profile")}}/>
            <div className={styles.textContainer}>
                <h4>{friend.user}</h4>
                <p>This user has {friend.newPosts} new posts</p>
            </div>
            <button className={styles.deleteFriend}></button>
        </div>
    );
}
 
export default Friend;