import { BASE_URL } from "../../services/interceptor";
import styles from "./Post.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface PostProps {
  id: number;
  userName: string;
  userProfilePictureUrl: string | null;
  caption: string;
  likeCount: number;
  comments: { userName: string; text: string }[];
  mediaUrls: string[];
}

const Post = ({ userName, userProfilePictureUrl, caption, likeCount, comments, mediaUrls }: PostProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? mediaUrls.length - 1 : prevIndex - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === mediaUrls.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className={styles.postContainer}>
      <div className={styles.postHeader}>
        <img
          src={userProfilePictureUrl != null ? BASE_URL + userProfilePictureUrl : "../../src/images/FitCheck-logo.png"}
          onClick={() => navigate(`/profile/${userName}`)}
          className={styles.posterProfile}
          alt="Profile"
        />
        <div className={styles.postInfo}>
          <h3 onClick={() => navigate(`/profile/${userName}`)} className={styles.username}>
            {userName}
          </h3>
          <p 
          className={`${styles.caption} ${isExpanded ? styles.expanded : ""}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {caption}
        </p>
        </div>
      </div>

      {mediaUrls.length > 0 && (
        mediaUrls.length > 1 ? (
          <div className={styles.sliderContainer}>
            <button className={styles.prevBtn} onClick={handlePrevImage}>‹</button>
            <div className={styles.imageWrapper}>
              <img src={BASE_URL + mediaUrls[currentImageIndex]} alt="Post media" className={styles.postImage} />
            </div>
            <button className={styles.nextBtn} onClick={handleNextImage}>›</button>
          </div>
        ) : (
          <div className={styles.imageWrapper}>
            <img src={BASE_URL + mediaUrls[0]} alt="Post media" className={styles.postImage} />
          </div>
        )
      )}

      <div className={styles.postFooter}>
        <div className={styles.postStats}>
          <button className={styles.likeBtn}></button>
          <h4>{likeCount}</h4>
          <button className={styles.commentBtn}></button>
          <h4>{comments.length}</h4>
        </div>
      </div>

      {comments.length > 0 && (
        <div className={styles.commentContainer}>
          {comments.slice(0, 3).map((comment, index) => (
            <div key={index} className={styles.comment}>
              <img src="/images/default-profile.png" alt="Commenter" />
              <h4>{comment.userName}: </h4>
              <p>{comment.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Post;
