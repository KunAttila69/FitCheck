import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./EditPage.module.css";
import { updateProfile, changePassword, uploadAvatar, handleLogout } from "../../services/authServices";
import { BASE_URL } from "../../services/interceptor";

interface PageProps {
  profile: any;
}

const EditPage = ({ profile }: PageProps) => {
  const navigate = useNavigate();

  const [changingPassword, setChangingPassword] = useState(false);
  const [name, setName] = useState(profile.username);
  const [aboutMe, setAboutMe] = useState(profile.bio);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const preview = URL.createObjectURL(file);
      setMediaFile(file);
      setPreviewFile(preview);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const success = await changePassword(oldPassword, newPassword, confirmPassword);
    if (success) {
      alert("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      alert("There was an error changing the password.");
    }
  };

  const handleSaveChanges = async () => { 
    if (name !== profile.username || aboutMe !== profile.bio) {
      try {
        const response = await updateProfile(name, profile.email, aboutMe) 
        console.log(response)
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("There was an error updating the profile.");
        return;
      }
    }
   
    if (mediaFile) {
      const formData = new FormData();
      formData.append("file", mediaFile);
  
      try { 
        const response = await uploadAvatar(formData) 
        console.log(response)
      } catch (error) {
        console.error("Error uploading avatar:", error);
        alert("There was an error uploading the avatar.");
        return;
      }
    }
   
    alert("Profile updated successfully!"); 
  };

  const Logout = () => {
    handleLogout();
    window.location.href = "/login";
  };

  return (
    <main className={styles.editContainer}>
      <header>
        <div className={`${styles.home} ${styles.icon}`} onClick={() => window.location.href = "/"} />
        <div className={`${styles.logout} ${styles.icon}`} onClick={() => Logout()} />

        <div className={styles.imageContainer}>
          <button className={styles.editBtn} onClick={() => document.getElementById("fileInput")?.click()}>
            <img src="../../src/images/upload.png" alt="Edit" />
          </button>

          {previewFile ? (
            <img src={previewFile} alt="Profile" />
          ) : profile.profilePictureUrl ? (
            <img src={BASE_URL+profile.profilePictureUrl} alt="Profile" />
          ) : (
            <img src="../../src/images/FitCheck-logo.png" alt="Profile" />
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
          placeholder={aboutMe !== "" ? "" : "About me..."}
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

      <button className={styles.confirmButton} onClick={handleSaveChanges}>
        Confirm Changes
      </button>

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
