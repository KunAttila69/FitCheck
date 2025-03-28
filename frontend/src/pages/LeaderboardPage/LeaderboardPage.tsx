import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./LeaderboardPage.module.css";
import { getLeaderBoard } from "../../services/authServices";
import { BASE_URL } from "../../services/interceptor";
import { useNavigate } from "react-router-dom";

interface UserType {
    profilePictureUrl: string;
    username: string;
    rank: number;
    likeCount: number;
    profile: any;
}

interface PageProps{
    profile: any
}

interface LeaderboardResponse {
    topUsers: UserType[];
    currentUserRank: UserType;
}

const LeaderboardRow = ({ user, profile }: { user: UserType; profile: UserType | null }) => {
    const navigate = useNavigate()
    return (
        <tr className={profile?.username == user.username ? styles.yourRow : ""}>
            <td>{user.rank}</td>
            <td className={styles.nameContainer} onClick={() => {navigate("/profile/"+user.username)}}>
                <img 
                    src={user.profilePictureUrl ? BASE_URL + user.profilePictureUrl : "/images/FitCheck-logo.png"} 
                    alt={user.username} 
                />
                {user.username}
            </td>
            <td>{user.likeCount}</td>
        </tr>
    );
};

const LeaderboardPage = ({profile} : PageProps) => {
    const [topList, setTopList] = useState<UserType[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [yourProfile, setYourProfile] = useState<UserType | null>(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response: LeaderboardResponse = await getLeaderBoard(); 
                console.log(response)
                const fetchedTopUsers = response?.topUsers || [];
                const yourProfileData = response?.currentUserRank;

                setYourProfile(yourProfileData);
 
                if (yourProfileData) {
                    if (!fetchedTopUsers.find(user => user.username === yourProfileData.username)) {
                        fetchedTopUsers.push({
                            ...yourProfileData,
                            rank: fetchedTopUsers.length + 1, 
                            likeCount: yourProfileData.likeCount
                        });
                    }
                }
 
                setTopList(fetchedTopUsers.sort((a, b) => a.rank - b.rank));
            } catch (error) {
                console.error("Failed to fetch leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <>
            <Navbar selectedPage="leaderboard" profilePic={profile.profilePictureUrl} />
            <main className={styles.container}>
                {loading ? (
                    <p className={styles.loading}>Loading leaderboard...</p>
                ) : (
                    <table className={styles.leaderboard}>
                        <thead>
                            <tr>
                                <td>Rank</td>
                                <td>Name</td>
                                <td>Likes</td>
                            </tr>
                        </thead>
                        <tbody>
                            {topList &&
                                topList.map((user) => (
                                    <LeaderboardRow
                                        key={user.rank}
                                        user={user}
                                        profile={yourProfile}
                                    />
                                ))}
                        </tbody>
                    </table>
                )}
            </main>
        </>
    );
};

export default LeaderboardPage;
