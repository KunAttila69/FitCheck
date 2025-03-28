import { useEffect, useState } from "react"; 
import Navbar from "../../components/Navbar/Navbar";
import Friend from "../../components/Friend/Friend";
import { getFollowing } from "../../services/authServices";
import Popup from "../../components/Popup/Popup";

interface FriendType {
  userId: string;
  username: string;
  profilePictureUrl: string;
  newPosts: number;
}

interface PageProps {
  profile: any;
}

interface MessageType{
  text: string,
  type: number
}


const FollowingPage = ({ profile }: PageProps) => {
  const [following, setFollowing] = useState<FriendType[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<MessageType | null>(null)

  useEffect(() => {
    const fetchFriends = async () => {
      const data: FriendType[] = await getFollowing();
      setFollowing(data);
      setLoading(false);
    };
    fetchFriends();
  }, []);

  const handleUnfollow = (userId: string) => {
    setFollowing((prevFollowing) => 
      prevFollowing.filter((friend) => friend.userId !== userId)
    );
  };

  const handleMessage = (message: string, type: number) => {
    console.log(message +" "+ type)
    setMessage({text: message, type})
  }

  return (
    <>
      {message && (<Popup message={message.text} type={message.type} reset={() => {setMessage(null)}}/>)}
      <Navbar selectedPage="following" profilePic={profile.profilePictureUrl} />
      <main>
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
      </main>
    </>
  );
};

export default FollowingPage;
