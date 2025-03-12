import styles from "./Post.module.css";
import { useNavigate } from "react-router-dom";

const Post = () => {
  const navigate = useNavigate()
    return ( 
        <div className={styles.postContainer}>
          <div className={styles.postHeader}>
            <img src="../../images/img.png" onClick={() => {navigate("/profile")}} className={styles.posterProfile}/>
            <div className={styles.postInfo}>
              <h3>gipsz.Jakab</h3>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio earum incidunt tempore sint, et doloribus sit magnam velit. Enim ipsum vero cum est sunt, excepturi earum vitae rerum sequi culpa!</p>
            </div>
          </div>
          <div className={styles.post}>
            <img src="../../images/img.png" />
          </div>
          <div className={styles.postFooter}>
            <div className={styles.postStats}>
              <button className={styles.likeBtn}></button>
              <h4>50</h4>
              <button className={styles.commentBtn}></button>
              <h4>50</h4>
            </div>
          </div>
          <div className={styles.commentContainer}>
            <div className={styles.comment}>
              <img src="../../images/img.png" />
              <h4>Gipsz Péter: </h4>
              <p>Jó kép</p>
            </div>
            <div className={styles.comment}>
              <img src="../../images/img.png" />
              <h4>Gipsz Péter: </h4>
              <p>Jó kép</p>
            </div>
          </div>
        </div>
    );
}
 
export default Post;