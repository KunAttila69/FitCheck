import { useNavigate } from "react-router-dom";
import styles from "./UserNotFoundPage.module.css";

const UserNotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.userNotFound}> 
            <h1>User Not Found</h1>
            <p>The user you are looking for does not exist.</p>
            <button onClick={() => navigate("/")}>Go Home</button>
        </div>
    );
};

export default UserNotFoundPage;
