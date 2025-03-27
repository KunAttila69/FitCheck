import { BASE_URL } from "../../services/interceptor";
import styles from "./Post.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { likePost, unlikePost, addComment, getComments } from "../../services/authServices";

interface PostProps {
  id: number;
  userName: string;
  userProfilePictureUrl: string | null;
  caption: string;
  likeCount: number;
  mediaUrls: string[];
  isLikedByCurrentUser: boolean;
  yourName: string;
}

interface Comment {
  authorUsername: string;
  text: string;
}

const Post = ({ id, userName, userProfilePictureUrl, caption, likeCount, mediaUrls, isLikedByCurrentUser, yourName }: PostProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [likes, setLikes] = useState(likeCount);
  const [isLiked, setLiked] = useState(isLikedByCurrentUser);
  const [commentText, setCommentText] = useState("");
  const [postComments, setPostComments] = useState<Comment[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const comments = await getComments(id.toString());
        setPostComments(comments || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [id]);

  const handleLikeClick = async () => {
    try {
      const result = await likePost(id.toString());
      if (result) {
        setLikes((prevLikes) => prevLikes + 1);
        setLiked(true);
      } else {
        console.error("Failed to like the post");
      }
    } catch (err) {
      console.error("Error liking the post:", err);
    }
  };

  const handleUnlikeClick = async () => {
    try {
      const result = await unlikePost(id.toString());
      if (result) {
        setLikes((prevLikes) => prevLikes - 1);
        setLiked(false);
      } else {
        console.error("Failed to unlike the post");
      }
    } catch (err) {
      console.error("Error unliking the post:", err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      const result = await addComment(id.toString(), commentText);
      if (result) {
        setPostComments((prevComments) => [
          ...prevComments,
          { authorUsername: "You", text: commentText },
        ]);
        setCommentText("");
      } else {
        console.error("Failed to add comment");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  return (
    <div className={styles.postContainer}>
      <div className={styles.postHeader}>
        <img
          src={userProfilePictureUrl ? BASE_URL + userProfilePictureUrl : "images/FitCheck-logo.png"}
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
          <button className={`${styles.likeBtn} ${isLiked ? styles.liked : ""}`} onClick={isLiked ? handleUnlikeClick : handleLikeClick}>
            ♥
          </button>
          <h4>{likes}</h4>
          <button className={styles.commentBtn}></button>
          <h4>{postComments.length}</h4>
        </div>
      </div>

      {postComments.length > 0 && (
        <div className={styles.commentContainer}>
          {postComments.slice(0, 3).map((comment, index) => (
            <div key={index} className={styles.comment}>
              <img src="images/FitCheck-logo.png" alt="Commenter" onClick={() => navigate(`/profile/${comment.authorUsername}`)}/>
              <h4>{comment.authorUsername !== yourName ? comment.authorUsername : "You"}: </h4>
              <p> {comment.text}</p>
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
