import { useEffect, useState } from "react"; 
import { fetchFeed } from "../../services/authServices";
import Post from "../../components/Post/Post";
import Navbar from "../../components/Navbar/Navbar";  
import LeaderboardComponent from "../../components/LeaderboardComponent/LeaderboardComponent";
import styles from "./HomePageStyle.module.css"
import FollowingComponent from "../../components/FollowingComponent/FollowingComponent";

interface PageProps {
  profile: any
}

interface PostType {
  id: number;
  userName: string;
  userProfilePictureUrl: string | null;
  caption: string;
  likeCount: number;
  mediaUrls: string[];
  isLikedByCurrentUser: boolean;
}

const HomePage = ({ profile }: PageProps) => {
  const [feed, setFeed] = useState<PostType[]>([]); 

  useEffect(() => {
    const loadFeed = async () => { 
      const posts = await fetchFeed();   
      setFeed(posts || []);
    }; 
    loadFeed(); 
  }, []);

  return (
    <>
      <Navbar selectedPage="home" profilePic={profile.profilePictureUrl}/> 
      <main className={styles.homePageMain}> 
        <div className={styles.leaderBoardContainer}>
          <LeaderboardComponent/>
        </div>
        <div className={styles.feedContainer}>
          {feed.length > 0 ? (
            feed.map((post, index) => <Post key={index} {...post} yourName={profile.username} yourPicture={profile.profilePictureUrl}/>)
          ) : (
            <p>No posts available.</p>
          )}
        </div>
        <div className={styles.followingContainer}>
          <FollowingComponent/>
        </div>
      </main>
    </>
  );
};

export default HomePage;
