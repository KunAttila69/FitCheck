import { useEffect, useState } from "react";
import styles from "./ProfilePage.module.css";
import { addFollow, getProfile, getUserProfile } from "../../services/authServices";
import Post from "../../components/Post/Post"; 
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../services/interceptor";

interface Profile {
    userId: string
    username: string;
    bio?: string;
    friendsCount: number;
    likesCount: number;
    profilePictureUrl: string | null;
    posts: { id: number; content: string }[]; 
}

const ProfilePage = () => { 
    const { username } = useParams<{ username: string }>();
    const [profile, setProfile] = useState<Profile | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkIfOwnProfile = async () => {
            try { 
                const user = await getUserProfile();

                if (user?.username === username) { 
                    navigate("/");
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        const fetchProfile = async () => {
            try {
                const data = await getProfile(username || "");
                console.log("Fetched Profile Data:", data);
                setProfile(data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
 
        checkIfOwnProfile();
         
        fetchProfile();
    }, [username]); 

    
    const handleFollow = async () => {
        try {
            if (!profile?.userId) {
               console.log("User ID is missing.");
                return;
          }
          const result = await addFollow(profile.userId);
          console.log("Friend added successfully:", result);
        } catch (error) {
            console.error("Error adding friend:", error);
        }
    };
      
  
    return (
    <> 
        <nav>
            <div className={styles.profileHeader}>
                <img src={profile?.profilePictureUrl == null ? "../../src/images/FitCheck-logo.png" : BASE_URL+profile?.profilePictureUrl} className={styles.profilePic} alt="Profile" />
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
                    <h2>{profile?.posts?.length ?? 0}</h2>
                </div>
            </div>
            <button className={styles.addFriend} onClick={() => {handleFollow()}}>Follow</button>
        </nav>
        <main>
  {/* {profile?.posts ? (
    profile.posts.map((post) => (
      <Post 
        key={post.id}
        id={post.id}
        userName={profile.username}
        userProfilePictureUrl={post.userProfilePictureUrl || null}
        caption={post.content}
        likeCount={post.likeCount ?? 0} 
        comments={post.comments ?? []}
        mediaUrls={post.mediaUrls ?? []}
      />
    ))
  ) : (
    <p>Loading posts...</p>
  )} */}
</main>
    </>
  );
};

export default ProfilePage;