import { deleteFollow } from "../../services/authServices";
import { BASE_URL } from "../../services/interceptor";
import styles from "./Friend.module.css";
import { useNavigate } from "react-router-dom";

interface FriendProps {
    friend: {
        profilePictureUrl: string;
        username: string;
        newPosts: number;
        userId: string;
    };
    onUnfollow: (userId: string) => void; 
}

const Friend = ({ friend, onUnfollow }: FriendProps) => {
    const navigate = useNavigate();

    const unFollow = async () => {
        try {
            const result = await deleteFollow(friend.userId);
            if (result) {
                onUnfollow(friend.userId); 
                console.log("Successfully unfollowed:", result);
            } else {
                console.log("Error: Unable to unfollow.");
            }
        } catch (error) {
            console.error("Unfollow failed:", error);
        }
    };

    return ( 
        <div className={styles.friendContainer}>
            <img 
                src={friend.profilePictureUrl 
                    ? BASE_URL + friend.profilePictureUrl 
                    : "images/FitCheck-logo.png"} 
                onClick={() => navigate("/profile/" + friend.username)}
                alt={`${friend.username}'s profile`}
            />
            <div className={styles.textContainer}>
                <h4>{friend.username}</h4>
                <p>This user has {friend.newPosts} new posts</p>
            </div>
            <button className={styles.deleteFriend} onClick={unFollow}> 
            </button>
        </div>
    );
};

export default Friend;
