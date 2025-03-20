import { useEffect, useState } from "react";
import "./HomePageStyle.module.css";
import { fetchFeed, getUserProfile } from "../../services/authServices";
import Post from "../../components/Post/Post";
import Navbar from "../../components/Navbar/Navbar";
import { BASE_URL } from "../../services/interceptor";

interface PageProps {
  fetchProfile: () => void;
}

const HomePage = ({ fetchProfile }: PageProps) => {
  const [feed, setFeed] = useState<any[]>([]);

  useEffect(() => {
    const loadFeed = async () => {
      fetchProfile();
      const posts = await fetchFeed();
      console.log(posts)
      setFeed(posts || []);
    };

    loadFeed();
  }, []);

  return (
    <>
      <Navbar selectedPage="home" />
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
