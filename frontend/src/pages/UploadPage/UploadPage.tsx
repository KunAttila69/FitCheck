import { useState } from "react";
import styles from "./UploadPage.module.css";
import Navbar from "../../components/Navbar/Navbar"; 
import { uploadPost } from "../../services/authServices";

interface PageProps{
    profile: any
}

const UploadPage = ({profile}: PageProps) => {  
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [previewFiles, setPreviewFiles] = useState<string[]>([]);
    const [caption, setCaption] = useState("");

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const fileArray = Array.from(files);
            const previewArray = fileArray.map(file => URL.createObjectURL(file));
            
            setMediaFiles(prevFiles => [...prevFiles, ...fileArray]);
            setPreviewFiles(prevPreviews => [...prevPreviews, ...previewArray]);
        }
    };

    const handleRemoveFile = (index: number) => {
        setMediaFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        setPreviewFiles(prevPreviews => prevPreviews.filter((_, i) => i !== index));
    };

    const handleUpload = async (event: React.FormEvent) => {
        event.preventDefault();
        if (mediaFiles.length === 0) {
            alert("Please select at least one file.");
            return;
        }

        await uploadPost(caption, mediaFiles);
        alert("Post uploaded successfully!");
        setMediaFiles([]);
        setPreviewFiles([]);
        setCaption("");
    };

    return ( 
        <>
            <Navbar selectedPage="post" profilePic={profile.profilePictureUrl}/>
            <main className={styles.editContainer}>
                <form className={styles.uploadForm} onSubmit={handleUpload}>
                    <label className={styles.imageContainer}>
                        <input 
                            type="file" 
                            accept="image/*,video/*" 
                            multiple 
                            onChange={handleFileSelect} 
                            style={{ display: "none" }} 
                        />
                        <div className={styles.uploadIcon}></div>
                        <h3>Select images or videos</h3>
                    </label>
 
                    <div className={styles.mediaPreviewContainer}>
                        {previewFiles.map((file, i) => (
                            <div key={i} className={styles.mediaPreview}>
                                <div className={styles.removeUpload}>
                                    <img 
                                        src="../../src/images/delete.png" 
                                        alt="Delete" 
                                        onClick={() => handleRemoveFile(i)}
                                    />
                                </div>
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
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    ></textarea>

                    <button type="submit" className={styles.uploadButton}>Upload</button>
                </form>
            </main>
        </>
    );
};

export default UploadPage;
