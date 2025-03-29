import Navbar from "../../components/Navbar/Navbar";
import LeaderboardComponent from "../../components/LeaderboardComponent/LeaderboardComponent";
import styles from "./FollowingPage.module.css"
import FollowingComponent from "../../components/FollowingComponent/FollowingComponent"; 
  
const FollowingPage = () => { 
  return (
    <>
      <Navbar selectedPage="following" />
      <main className={styles.followingPageMain}>
        <div className={styles.leaderBoardContainer}>
          <LeaderboardComponent/>
        </div>
        <FollowingComponent/>
      </main>
    </>
  );
};

export default FollowingPage;
