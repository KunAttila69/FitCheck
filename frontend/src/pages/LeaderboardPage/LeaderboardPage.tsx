import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./LeaderboardPage.module.css";
import { getLeaderBoard } from "../../services/authServices";
import { BASE_URL } from "../../services/interceptor";

interface PageProps {
    profile: any;
}

interface UserType {
    profilePictureUrl: string;
    username: string;
    rank: number;
    likeCount: number;
}

const LeaderboardRow = ({ user }: { user: UserType }) => {
    return (
        <tr>
            <td>{user.rank}</td>
            <td className={styles.nameContainer}>
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

const LeaderboardPage = ({ profile }: PageProps) => {
    const [topList, setTopList] = useState<UserType[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await getLeaderBoard();
                setTopList(response?.topUsers || []);
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
                            {topList && topList.map((user) => <LeaderboardRow key={user.rank} user={user} />)}
                        </tbody>
                    </table>
                )}
            </main>
        </>
    );
};

export default LeaderboardPage;
