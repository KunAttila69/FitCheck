import { useNavigate } from "react-router-dom";
import styles from "./UserNotFoundPage.module.css"
const UserNotFoundPage = () => {
    const navigate = useNavigate()
    return ( 
        <>
            
            <div className={`${styles.home} ${styles.icon}`} onClick={() => navigate("/")}></div>
            <h3 className={styles.usernotfound}>User not found</h3>
        </>
    );
}
 
export default UserNotFoundPage;