import { useState } from "react";
import styles from "./UploadPage.module.css";
import Navbar from "../../components/Navbar/Navbar"; 
import { uploadPost } from "../../services/authServices";
import Popup from "../../components/Popup/Popup";
import LeaderboardComponent from "../../components/LeaderboardComponent/LeaderboardComponent";
import FollowingComponent from "../../components/FollowingComponent/FollowingComponent"; 

interface MessageType{
    text: string,
    type: number
}

const UploadPage = () => {  
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [previewFiles, setPreviewFiles] = useState<string[]>([]);
    const [caption, setCaption] = useState("");
    const [message, setMessage] = useState<MessageType | null>(null) 

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
            setMessage({text: "Please select at least one file.", type: 1}); 
            console.log(message)
            return;
        }
        if (caption.trim() === "") {
            setMessage({text: "Please write a caption.", type: 1}); 
            console.log(message)
            return;
        }

        await uploadPost(caption, mediaFiles);
        setMessage({text:"Post uploaded successfully!", type: 2});
        setMediaFiles([]);
        setPreviewFiles([]);
        setCaption("");
    };

    return ( 
        <>
            {message && (<Popup message={message.text} type={message.type} reset={() => {setMessage(null)}}/>)}
            <Navbar selectedPage="post"/>
            <main className={styles.uploadPageMain}>
                <div className={styles.leaderBoardContainer}>
                    <LeaderboardComponent/>
                </div>
                <div className={styles.uploadContainer}>
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
                </div>
                <div className={styles.followingContainer}>
                <FollowingComponent/>
                </div>

            </main>
        </>
    );
};

export default UploadPage;
