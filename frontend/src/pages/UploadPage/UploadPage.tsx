import { useState } from "react";
import styles from "./UploadPage.module.css";
import Navbar from "../../components/Navbar/Navbar";

const UploadPage: React.FC = () => {  
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
 
    const SelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file)); 
        }
    };

    return ( 
        <>
            <Navbar selectedPage="post"/>
            <main className={styles.editContainer}>
                <form className={styles.uploadForm}>
                    <label className={styles.imageContainer}>
                        <input type="file" accept="image/*" onChange={SelectImage} style={{ display: "none" }} />
                        <div className={styles.uploadIcon}></div>
                        {selectedImage ? (
                            <img src={selectedImage} alt="Selected" className={styles.previewImage} />
                        ) : (
                            <h3>Select an image</h3>
                        )}
                    </label>
                    <textarea 
                        className={styles.descriptionInput} 
                        placeholder="Add description"
                    ></textarea>
                </form>
            </main>
        </>
    );
};
 
export default UploadPage;
