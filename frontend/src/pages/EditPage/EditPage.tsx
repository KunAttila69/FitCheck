import styles from "./EditPage.module.css"
import { useNavigate } from "react-router-dom";
const EditPage = () => {
    const navigate = useNavigate()
    return ( 
        <main className={styles.editContainer}>
            <header>
                <div className={`${styles.home} ${styles.icon}`} onClick={() => navigate("/")}></div>
                <div className={`${styles.logout} ${styles.icon}`} onClick={() => navigate("/login")}></div>
                <div className={styles.imageContainer}>
                    <button className={styles.editBtn}><img src="../../src/images/edit.png" alt="" /></button>
                    <img src="../../images/img.png"/>
                </div>
                <input type="text" className={styles.nameChanger} value={"Gipsz.Jakab"}/>
                <textarea className={styles.aboutMeSection}>About me...</textarea>
            </header>
            <form>
                <button className={styles.passwordActivationBtn}>Change password</button>
                <div className={styles.passwordChanger}>
                    <label>Old Password</label>
                    <input type="text" />
                    <label>New Password</label>
                    <input type="text"/>
                    <label>Confirm Password</label>
                    <input type="text"/>
                </div>
                <button className={styles.confirmButton}>Confirm Changes</button>
            </form>
        </main>
    );
}
 
export default EditPage;