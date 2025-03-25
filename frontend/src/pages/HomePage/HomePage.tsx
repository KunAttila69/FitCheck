import { useEffect, useState } from "react";
import "./HomePageStyle.module.css";
import { fetchFeed, getUserProfile } from "../../services/authServices";
import Post from "../../components/Post/Post";
import Navbar from "../../components/Navbar/Navbar"; 

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
    console.log(profile)
    loadFeed(); 
  }, []);

  return (
    <>
      <Navbar selectedPage="home" profilePic={profile.profilePictureUrl}/>
      <main>
        {feed.length > 0 ? (
          feed.map((post, index) => <Post key={index} {...post} />)
        ) : (
          <p>No posts available.</p>
        )}
      </main>
    </>
  );
};

export default HomePage;
