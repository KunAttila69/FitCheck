import Navbar from "../../components/Navbar/Navbar";
import LeaderboardComponent from "../../components/LeaderboardComponent/LeaderboardComponent";
import styles from "./FollowingPage.module.css"
import FollowingComponent from "../../components/FollowingComponent/FollowingComponent";


interface PageProps {
  profile: any;
}





const FollowingPage = ({ profile }: PageProps) => {




  return (
    <>
      <Navbar selectedPage="following" profilePic={profile.profilePictureUrl} />
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
