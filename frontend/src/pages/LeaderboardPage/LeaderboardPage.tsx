import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./LeaderboardPage.module.css";
import { getLeaderBoard } from "../../services/authServices";
import { BASE_URL } from "../../services/interceptor";
import { useNavigate } from "react-router-dom";
import LeaderboardComponent from "../../components/LeaderboardComponent/LeaderboardComponent";



interface PageProps{
    profile: any
}

const LeaderboardPage = ({profile} : PageProps) => {
 

    return (
        <>
            <Navbar selectedPage="leaderboard" profilePic={profile.profilePictureUrl} />
            <main className={styles.container}>
                <LeaderboardComponent/>
            </main>
        </>
    );
};

export default LeaderboardPage;
