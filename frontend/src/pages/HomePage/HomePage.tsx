import { useEffect, useState } from "react";
import "./HomePageStyle.module.css";
import { fetchFeed } from "../../services/authServices";
import Post from "../../components/Post/Post";
import Navbar from "../../components/Navbar/Navbar"; 
import LeaderboardPage from "../LeaderboardPage/LeaderboardPage";

interface PageProps {
  profile: any
}

const HomePage = ({ profile }: PageProps) => {
  const [feed, setFeed] = useState<any[]>([]); 

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
      <main> 
        {feed.length > 0 ? (
          feed.map((post, index) => <Post key={index} {...post} yourName={profile.username} yourPicture={profile.profilePictureUrl}/>)
        ) : (
          <p>No posts available.</p>
        )}
      </main>
    </>
  );
};

export default HomePage;
