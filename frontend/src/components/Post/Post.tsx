import { BASE_URL } from "../../services/interceptor";
import styles from "./Post.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { likePost, unlikePost, addComment, getComments, flagComment, flagPost } from "../../services/authServices";
import { useProfile } from "../../contexts/ProfileContext";

interface PostProps {
  id: number;
  userName: string;
  userProfilePictureUrl: string | null;
  caption: string;
  likeCount: number;
  mediaUrls: string[];
  isLikedByCurrentUser: boolean; 
  likeFunction?: () => void;
}

interface Comment {
  authorUsername: string;
  text: string;
  id: number;
  authorProfilePictureUrl: string;
}

const Post = ({ id, userName, userProfilePictureUrl, caption, likeCount, mediaUrls, isLikedByCurrentUser, likeFunction }: PostProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [likes, setLikes] = useState(likeCount);
  const [isLiked, setLiked] = useState(isLikedByCurrentUser);
  const [commentText, setCommentText] = useState("");
  const [postComments, setPostComments] = useState<Comment[]>([]);
  const navigate = useNavigate();
  const { profile } = useProfile()
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const comments = await getComments(id.toString());
        console.log(comments)
        setPostComments(comments || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [id]);

  const toggleLike = async () => {
    try {
      if (isLiked) {
        const result = await unlikePost(id.toString());
        if (result) {
          setLikes((prev) => prev - 1);
          setLiked(false);
        }
      } else {
        const result = await likePost(id.toString());
        if (result) {
          setLikes((prev) => prev + 1);
          setLiked(true);
        }
      }
      if (likeFunction) likeFunction();
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };
  

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      const result = await addComment(id.toString(), commentText);
      if (result) {
        window.location.reload()
        setCommentText("");
      } else {
        console.error("Failed to add comment");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const deletePost = async () => {
    try {
      const result = await flagPost(id.toString());
      if (result) {
        console.log("Post deleted successfully");
        window.location.reload() 
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };
  
  const deleteComment = async (commentId: string) => {
    try {
      const result = await flagComment(commentId);
      if (result) {
        setPostComments((prevComments) =>
          prevComments.filter((comment) => comment.authorUsername !== commentId)
        );
        console.log("Comment deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };
  

  return (
    <div className={styles.postContainer}>
      <div className={styles.postHeader}>
        <img
          src={userProfilePictureUrl ? BASE_URL + userProfilePictureUrl : "/images/FitCheck-logo.png"}
          onClick={() => navigate(`/profile/${userName}`)}
          className={styles.posterProfile}
          alt="Profile"
        />
        <div className={styles.postInfo}>
          <h3 onClick={() => navigate(`/profile/${userName}`)} className={styles.username}>
            {userName}
          </h3>
          <p className={`${styles.caption} ${isExpanded ? styles.expanded : ""}`} onClick={() => setIsExpanded(!isExpanded)}>
            {caption}
          </p>
        </div>
        {(profile?.roles.includes("Moderator") || profile?.roles.includes("Admin")) && <img  src="../../src/images/delete.svg" onClick={() => deletePost()} className={styles.deletePostBtn}/>}
      </div>

      {mediaUrls.length > 0 && (
        <div className={styles.imageWrapper}>
          <img src={BASE_URL + mediaUrls[currentImageIndex]} alt="Post media" className={styles.postImage} />
          {mediaUrls.length > 1 && (
            <>
              <button className={styles.prevBtn} onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? mediaUrls.length - 1 : prev - 1))}>‹</button>
              <button className={styles.nextBtn} onClick={() => setCurrentImageIndex((prev) => (prev === mediaUrls.length - 1 ? 0 : prev + 1))}>›</button>
            </>
          )}
        </div>
      )}

      <div className={styles.postFooter}>
        <div className={styles.postStats}>
          <button className={`${styles.likeBtn} ${isLiked ? styles.liked : ""}`} onClick={toggleLike}></button>
          <h4>{likes}</h4>
          <button className={styles.commentBtn}></button>
          <h4>{postComments.length}</h4>
        </div>
      </div>

      {postComments.length > 0 && (
        <div className={styles.commentContainer}>
          {postComments.map((comment, index) => (
            <div key={index} className={styles.comment}>
              <img className={styles.commentImg} src={comment?.authorProfilePictureUrl !== null ? BASE_URL + comment.authorProfilePictureUrl : "/images/FitCheck-logo.png"} alt="Commenter" onClick={() => navigate(`/profile/${comment.authorUsername}`)}/>
              <h4>{comment.authorUsername !== profile?.username ? comment.authorUsername : "You"}: </h4>
              <p> {comment.text}</p>
              {(profile?.roles.includes("Moderator") || profile?.roles.includes("Admin")) && <img  src="../../src/images/delete.svg" onClick={() => deleteComment(index.toString())} className={styles.deleteCommentBtn}/>}
          </div>
          ))}
        </div>
      )}

      <div className={styles.commentInputContainer}>
        <input
          type="text"
          className={styles.commentInput}
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button className={styles.commentSubmitBtn} onClick={handleCommentSubmit}>
          Post
        </button>
      </div>
    </div>
  );
};

export default Post;
