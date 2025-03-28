import { useEffect } from "react";
import styles from "./Popup.module.css"

interface PopupParams{
    message: string;
    type: number;
    reset: () => void
}

const Popup = ({message, type, reset}: PopupParams) => {

    useEffect(() => { 
        const timer = setTimeout(() => {reset()}, 3000);
        return () => clearTimeout(timer); 
    }, [message]);

    return ( 
        <div className={`${styles.popup} ${type == 1 ? styles.error : styles.success}`}>
            <p>{message}</p>
            <button onClick={() => { reset() }}>X</button>
      </div>
    );
}
 
export default Popup;