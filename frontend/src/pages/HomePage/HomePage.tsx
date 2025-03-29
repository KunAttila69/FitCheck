import { useEffect, useState } from "react"; 
import { fetchFeed } from "../../services/authServices";
import Post from "../../components/Post/Post";
import Navbar from "../../components/Navbar/Navbar";  
import LeaderboardComponent from "../../components/LeaderboardComponent/LeaderboardComponent";
import styles from "./HomePageStyle.module.css"
import FollowingComponent from "../../components/FollowingComponent/FollowingComponent"; 

interface PostType {
  id: number;
  userName: string;
  userProfilePictureUrl: string | null;
  caption: string;
  likeCount: number;
  mediaUrls: string[];
  isLikedByCurrentUser: boolean;
}

const HomePage = () => {
  const [feed, setFeed] = useState<PostType[]>([]);  
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const loadFeed = async () => {
      if (loading || !hasMore) return;
      setLoading(true);

      const newPosts = await fetchFeed(page);

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setFeed((prev) => [...prev, ...newPosts]);
        setPage((prev) => prev + 1);
      }

      setLoading(false);
    };
 
    loadFeed();
 
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        loadFeed();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, loading, hasMore]);

  return (
    <>
      <Navbar selectedPage="home"/>
      <main className={styles.homePageMain}> 
        <div className={styles.leaderBoardContainer}>
          <LeaderboardComponent/>
        </div>
        <div className={styles.feedContainer}>
          {feed.length > 0 ? (
            feed.map((post) => (
              <Post 
                key={post.id} 
                {...post}  
              />
            ))
          ) : (
            <p>No posts available.</p>
          )}
          {loading && <p className={styles.endText}>Loading more posts...</p>}
          {!hasMore && <p className={styles.endText}>No more posts to load.</p>}
        </div>
        <div className={styles.followingContainer}>
          <FollowingComponent/>
        </div>
      </main>
    </>
  );
};

export default HomePage;
