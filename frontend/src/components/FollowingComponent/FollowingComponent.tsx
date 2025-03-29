import { useEffect, useState } from "react"; 
import Friend from "../../components/Friend/Friend";
import { getFollowing } from "../../services/authServices";
import Popup from "../../components/Popup/Popup";
import styles from "./FollowingComponent.module.css"

interface FriendType {
    userId: string;
    username: string;
    profilePictureUrl: string;
    newPosts: number;
  }
  interface MessageType{
    text: string,
    type: number
  }

const FollowingComponent = () => {
    const [following, setFollowing] = useState<FriendType[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<MessageType | null>(null)
    const handleUnfollow = (userId: string) => {
      setFollowing((prevFollowing) => 
        prevFollowing.filter((friend) => friend.userId !== userId)
      );
    };
    const handleMessage = (message: string, type: number) => {
      console.log(message +" "+ type)
      setMessage({text: message, type})
    }
    useEffect(() => {
      const fetchFriends = async () => {
        const data: FriendType[] = await getFollowing();
        setFollowing(data);
        setLoading(false);
      };
      fetchFriends();
    }, []);
    return(
      <>
        {message && (<Popup message={message.text} type={message.type} reset={() => {setMessage(null)}}/>)}
        <div className={styles.followingListContainer}>
        {loading ? (
          <p>Loading following...</p>
        ) : following.length > 0 ? (
          following.map((follow, i) => (
            <Friend 
              friend={follow} 
              key={i} 
              onUnfollow={() => handleUnfollow(follow.userId)} 
              handleMessage={handleMessage}
            />
          ))
        ) : (
          <p>Looks like you don't follow anyone.</p>
        )}
      </div>
      </>
    )
  }

export default FollowingComponent