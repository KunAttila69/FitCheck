import { deleteFollow } from "../../services/authServices";
import { BASE_URL } from "../../services/interceptor";
import styles from "./Friend.module.css";
import { useNavigate } from "react-router-dom";

interface FriendProps {
  friend: {
    profilePictureUrl: string;
    username: string;
    newPosts: number;
    recentPostsCount: number;
    userId: string;
  };
  onUnfollow: (userId: string) => void;
  handleMessage: (text: string, type: number) => void;
}

const Friend = ({ friend, onUnfollow, handleMessage }: FriendProps) => {
  const navigate = useNavigate(); 
  const unFollow = async () => {
    try {
      const result = await deleteFollow(friend.userId);
      if (result) {
        onUnfollow(friend.userId);
        handleMessage("Successfully unfollowed.", 2);
      } else {
        handleMessage("Error: Unable to unfollow.", 1);
      }
    } catch (error) {
      console.error("Unfollow failed:", error);
    }
  };

  return (
    <div className={styles.friendContainer}>
      <img
        src={friend.profilePictureUrl ? BASE_URL + friend.profilePictureUrl : "/images/FitCheck-logo.png"}
        onClick={() => navigate("/profile/" + friend.username)}
        alt={`${friend.username}'s profile`}
        className={styles.actorProfilePic}
      />
      <div className={styles.textContainer}>
        <h4>{friend.username}</h4>
        <p>This user has {friend.recentPostsCount > 0 ? friend.recentPostsCount : "no"} new posts</p>
      </div>
      <button className={styles.declineBtn} onClick={unFollow}></button>
    </div>
  );
};

export default Friend;
