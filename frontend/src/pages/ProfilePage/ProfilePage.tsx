import { useEffect, useState } from "react";
import styles from "./ProfilePage.module.css";
import { addFollow, getProfile, getUserProfile, getUserPosts } from "../../services/authServices";
import Post from "../../components/Post/Post"; 
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../services/interceptor";

interface PostData {
    id: number;
    content: string;
    userProfilePictureUrl?: string;
    likeCount?: number; 
    mediaUrls?: string[];
    isLikedByCurrentUser: boolean;
    yourName: string;
}

interface Profile {
    userId: string;
    username: string;
    bio?: string;
    friendsCount: number;
    likesCount: number;
    profilePictureUrl: string | null; 
}

interface ProfilePageProps {
    yourName: string | undefined;
}

const ProfilePage = ({yourName} : ProfilePageProps) => { 
    const { username } = useParams<{ username: string }>();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<PostData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
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
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };

        const fetchPosts = async () => {
            try {
                const userPosts = await getUserPosts(username || "");
                console.log(userPosts)
                setPosts(userPosts);
            } catch (err) {
                console.error("Error fetching posts:", err);
            }
        };

        fetchProfile();
        fetchPosts();
    }, [username, navigate]); 

    const handleFollow = async () => {
        if (!profile?.userId) return;
        try {
            await addFollow(profile.userId);
            console.log("Friend added successfully.");
        } catch (error) {
            console.error("Error adding friend:", error);
        }
    };

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p>{error}</p>;

    return (
        <> 
            <nav>
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
                    <div className={`${styles.home} ${styles.icon}`} onClick={() => navigate("/")}></div>
                </div>

                <div className={styles.profileStats}>
                    <div className={styles.friendsContainer}>
                        <h5>Friends</h5>
                        <h2>{profile?.friendsCount ?? 0}</h2>
                    </div>
                    <div className={styles.likesContainer}>
                        <h5>Likes</h5>
                        <h2>{profile?.likesCount ?? 0}</h2>
                    </div>
                    <div className={styles.postCountContainer}>
                        <h5>Posts</h5>
                        <h2>{posts.length}</h2>
                    </div>
                </div>
                <button className={styles.addFriend} onClick={handleFollow}>Follow</button>
            </nav>

            <main>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <Post 
                            key={post.id}
                            id={post.id}
                            userName={profile?.username || ""}
                            userProfilePictureUrl={post.userProfilePictureUrl || ""}
                            caption={post.content}
                            likeCount={post.likeCount ?? 0}  
                            mediaUrls={post.mediaUrls ?? []}
                            isLikedByCurrentUser={post.isLikedByCurrentUser}
                            yourName={yourName || ""}
                        />
                    ))
                ) : (
                    <p>No posts yet.</p>
                )}
            </main>
        </>
    );
};

export default ProfilePage;
