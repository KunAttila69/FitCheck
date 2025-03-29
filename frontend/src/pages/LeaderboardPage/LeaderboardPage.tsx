import Navbar from "../../components/Navbar/Navbar";
import styles from "./LeaderboardPage.module.css"; 
import LeaderboardComponent from "../../components/LeaderboardComponent/LeaderboardComponent";

const LeaderboardPage = () => {  
    return (
        <>
            <Navbar selectedPage="leaderboard"/>
            <main className={styles.container}>
                <LeaderboardComponent/>
            </main>
        </>
    );
};

export default LeaderboardPage;
