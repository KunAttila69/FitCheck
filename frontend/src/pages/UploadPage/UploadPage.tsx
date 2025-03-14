import { useState } from "react";
import styles from "./UploadPage.module.css";
import Navbar from "../../components/Navbar/Navbar";

const UploadPage = () => {  
    const [mediaFiles, setMediaFiles] = useState<string[]>([]);
 
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newFiles = Array.from(files).map(file => URL.createObjectURL(file));
            setMediaFiles(prevFiles => [...prevFiles, ...newFiles]); 
        }
    };

    const handleRemoveFile = (index: number) => {
        setMediaFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    return ( 
        <>
            <Navbar selectedPage="post"/>
            <main className={styles.editContainer}>
                <form className={styles.uploadForm}>
                    <label className={styles.imageContainer}>
                        <input type="file" accept="image/*,video/*" multiple onChange={handleFileSelect} style={{ display: "none" }} />
                        <div className={styles.uploadIcon}></div>
                        <h3>Select images or videos</h3>
                    </label>
 
                    <div className={styles.mediaPreviewContainer}>
                        {mediaFiles.map((file, i) => (
                            <div key={i} className={styles.mediaPreview}>
                                <div className={styles.removeUpload}><img src="../../src/images/delete.png" onClick={() => {handleRemoveFile(i)}}/></div>
                                {file.includes("video") ? (
                                    <video src={file} controls className={styles.previewVideo} />
                                ) : (
                                    <img src={file} alt={`Preview ${i}`} className={styles.previewImage} />
                                )}
                            </div>
                        ))}
                    </div>

                    <textarea 
                        className={styles.descriptionInput} 
                        placeholder="Add description"
                    ></textarea>

                    <button className={styles.uploadButton}>Upload</button>
                </form>
            </main>
        </>
    );
};

export default UploadPage;
