import { useEffect, useState } from "react"; 
import Navbar from "../../components/Navbar/Navbar";
import Friend from "../../components/Friend/Friend";
import { getFriends } from "../../services/authServices";

interface PageProps{
  profile: any
}

const FriendsPage = ({profile}:PageProps) => {
    const [friends, setFriends] = useState([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFriends = async () => {
            const data = await getFriends();
            setFriends(data);
            setLoading(false); 
          }; 
        fetchFriends();
    }, []);

    return (
      <>
        <Navbar selectedPage="friends" profilePic={profile.profilePictureUrl}/>
        <main>
          {loading ? (
            <p>Loading friends...</p>
          ) : friends.length > 0 ? (
            friends.map((friend, i) => (
              <Friend friend={friend} key={i} />
            ))
          ) : (
            <p>No friends found.</p>
          )}
        </main>
      </>
    );
};

export default FriendsPage;
