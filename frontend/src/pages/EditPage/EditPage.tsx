import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./EditPage.module.css";

const EditPage = () => {
    const navigate = useNavigate();
 
    const [changingPassword, setChangingPassword] = useState(false);
    const [name, setName] = useState("Gipsz.Jakab");
    const [aboutMe, setAboutMe] = useState("About me...");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [mediaFile, setMediaFile] = useState<File | null>(null);  // Holds one file
    const [previewFile, setPreviewFile] = useState<string | null>(null);  // Holds the preview URL of the file

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];  // Select only the first file
            const preview = URL.createObjectURL(file);  // Generate a preview URL
            
            setMediaFile(file);  // Update the state with the selected file
            setPreviewFile(preview);  // Update the state with the preview URL
        }
    };

    const handleImgChange = () => {
        document.getElementById("fileInput")?.click();
    };

    const handlePasswordChange = () => {
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        } 
        console.log("Password changed successfully!");
    };

    return ( 
        <main className={styles.editContainer}>
            <header>
                <div className={`${styles.home} ${styles.icon}`} onClick={() => navigate("/")}></div>
                <div className={`${styles.logout} ${styles.icon}`} onClick={() => navigate("/login")}></div>

                <div className={styles.imageContainer}>
                    <button className={styles.editBtn} onClick={handleImgChange}>
                        <img src="../../src/images/upload.png" alt="Edit" />
                    </button>
 
                    {previewFile ? (
                        <img src={previewFile} alt="Profile" />
                    ) : (
                        <img src="/images/img.png" alt="Profile" />
                    )}
                </div>

                <input 
                    type="text" 
                    className={styles.nameChanger} 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                />

                <textarea 
                    className={styles.aboutMeSection} 
                    value={aboutMe} 
                    onChange={(e) => setAboutMe(e.target.value)}
                />
            </header>

            <button 
                className={styles.passwordActivationBtn} 
                onClick={() => setChangingPassword(!changingPassword)}
            >
                {changingPassword ? "Cancel" : "Change password"}
            </button>

            {changingPassword && (
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className={styles.passwordChanger}>
                        <label>Old Password</label>
                        <input 
                            type="password" 
                            value={oldPassword} 
                            onChange={(e) => setOldPassword(e.target.value)}
                        />

                        <label>New Password</label>
                        <input 
                            type="password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                        <label>Confirm Password</label>
                        <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <button type="button" className={styles.confirmButton} onClick={handlePasswordChange}>
                            Confirm Password Change
                        </button>
                    </div>
                </form>
            )}

            <button className={styles.confirmButton}>Confirm Changes</button>
 
            <input 
                type="file" 
                id="fileInput" 
                style={{ display: "none" }} 
                onChange={handleFileSelect} 
            />
        </main>
    );
};

export default EditPage;
