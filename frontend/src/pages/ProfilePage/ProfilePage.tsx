import { useEffect, useState } from "react";
import styles from "./ProfilePage.module.css";
import { addFollow, getProfile, getUserProfile, getUserPosts, deleteFollow } from "../../services/authServices";
import Post from "../../components/Post/Post"; 
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../services/interceptor";
import LeaderboardComponent from "../../components/LeaderboardComponent/LeaderboardComponent";
import Popup from "../../components/Popup/Popup";
import FollowingComponent from "../../components/FollowingComponent/FollowingComponent"; 

interface PostData {
    id: number;
    caption: string;
    profilePictureUrl?: string | null;
    likeCount?: number; 
    mediaUrls?: string[];
    isLikedByCurrentUser: boolean;
    yourName: string;
}

interface Profile {
    id: string;
    username: string;
    isFollowing: boolean;
    followerCount: number
    bio?: string;
    likesCount: number;
    profilePictureUrl: string | null; 
}

interface MessageType {
    text: string;
    type: number;
}

const ProfilePage = () => { 
    const { username } = useParams<{ username: string }>();
    const [profile, setProfile] = useState<Profile | null>(null); 
    const [isFollowing, setFollowing] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<PostData[]>([]);
    const [postCount, setPostCount] = useState(0);
    const [message, setMessage] = useState<MessageType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchProfile = async () => { 
        try {
            const user = await getUserProfile();
            if (user?.username === username) {
                navigate("/");
                return;
            }
            const data = await getProfile(username || "");
            if (!data) {
                navigate("/profile/not-found");
            } else {
                setProfile(data);   
                setFollowing(data.isFollowing);
            }
        } catch (err) {
            console.error("Error fetching profile:", err);
            setError("Failed to load profile.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        const fetchPosts = async () => {
            try {
                const userPosts = await getUserPosts(username || "");
                setPosts(userPosts.posts);
                setPostCount(userPosts.totalCount);
            } catch (err) {
                console.error("Error fetching posts:", err);
            }
        };

        fetchProfile();
        fetchPosts();
    }, [username, navigate]); 

    const handleFollow = async () => { 
        if (!profile?.id) return
        try {
            if (!isFollowing) {
                await addFollow(profile.id);
                setFollowing(true);
                setMessage({ text: `Successfully followed ${profile.username}.`, type: 2 });  
            } else {
                await deleteFollow(profile.id);
                setFollowing(false);
                setMessage({ text: `Successfully unfollowed ${profile.username}.`, type: 2 }); 
            }
            fetchProfile()
        } catch (error) {
            console.error("Error adding friend:", error);
            setMessage({ text: "Something went wrong!", type: 3 }); 
        }
    };

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p>{error}</p>;

    return (
        <> 
            {message && (
                <Popup message={message.text} type={message.type} reset={() => setMessage(null)} />
            )}
            <nav className={styles.profileNav}>
                <div className={styles.profileHeader}>
                    <img 
                        src={profile?.profilePictureUrl ? BASE_URL + profile.profilePictureUrl : "/images/FitCheck-logo.png"} 
                        className={styles.profilePic} 
                        alt="Profile" 
                    />
                    <div>
                        <h3>{profile?.username || "Loading..."}</h3>
                        <p>{profile?.bio || "No bio available"}</p>
                    </div> 
                    <div className={styles.profileResponsiveStats}>
                        <div>
                            <h5>Followers</h5>
                            <h2>{profile?.followerCount ?? 0}</h2>
                        </div>
                        <div>
                            <h5>Likes</h5>
                            <h2>{profile?.likesCount ?? 0}</h2>
                        </div>
                        <div>
                            <h5>Posts</h5>
                            <h2>{postCount}</h2>
                        </div>
                    </div>
                    <button className={`${styles.responsiveFollow} ${isFollowing ? styles.unfollow : styles.follow}`} onClick={handleFollow}>
                        {isFollowing ? "Unfollow" : "Follow"}
                    </button>
                    <div className={`${styles.home} ${styles.icon}`} onClick={() => navigate("/")}></div>
                </div>
    
                <div className={styles.profileStats}>
                    <div>
                        <h5>Followers</h5>
                        <h2>{profile?.followerCount ?? 0}</h2>
                    </div>
                    <div>
                        <h5>Likes</h5>
                        <h2>{profile?.likesCount ?? 0}</h2>
                    </div>
                    <div>
                        <h5>Posts</h5>
                        <h2>{postCount}</h2>
                    </div>
                </div>
                <button className={`${styles.addFriend} ${isFollowing ? styles.unfollow : styles.follow}`} onClick={handleFollow}>
                    {isFollowing ? "Unfollow" : "Follow"}
                </button>
            </nav>
    
            <main className={styles.profilePostsMain}>
                <div className={styles.leaderBoardContainer}> 
                    <LeaderboardComponent />
                </div>
                <div className={styles.postsContainer}>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <Post 
                                key={post.id}
                                id={post.id}
                                userName={profile?.username || ""}
                                userProfilePictureUrl={post.profilePictureUrl || null}
                                caption={post.caption}
                                likeCount={post.likeCount ?? 0}  
                                mediaUrls={post.mediaUrls ?? []}
                                isLikedByCurrentUser={post.isLikedByCurrentUser} 
                                likeFunction={fetchProfile}
                            />
                        ))
                    ) : (
                        <p>No posts yet.</p>
                    )}
                </div>
                <div className={styles.followingContainer}>
                    <FollowingComponent/>
                </div>
            </main>
        </>
    );
};

export default ProfilePage;
