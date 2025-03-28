import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./LeaderboardPage.module.css";
import { getLeaderBoard } from "../../services/authServices";
import { BASE_URL } from "../../services/interceptor";

interface PageProps {
    profile: any;
}

interface UserType{
    profilePictureUrl: string,
    username: string,
    rank: number,
    likeCount: number,
}

const LeaderboardPage = ({ profile }: PageProps) => {
    const [topList, setTopList] = useState<UserType[] | null>(null);



    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await getLeaderBoard();
                console.log(response);
                setTopList(response?.topUsers || []); // Ensure topUsers exists
            } catch (error) {
                console.error("Failed to fetch leaderboard:", error);
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <>
            <Navbar selectedPage="leaderboard" profilePic={profile.profilePictureUrl} />
            <main>
                {topList != null && <table className={styles.leaderboard}>
                    <thead>
                        <tr>
                            <td>Rank</td>
                            <td>Name</td>
                            <td>Likes</td>
                        </tr>
                    </thead>
                    <tbody>
                        {topList.map((user: UserType) => (
                            <tr key={user.rank}>
                                <td>{user.rank}</td>
                                <td className={styles.nameContainer}>
                                    <img 
                                        src={user.profilePictureUrl !== null ? BASE_URL + user.profilePictureUrl : "/images/FitCheck-logo.png"} 
                                        alt={user.username} 
                                    />
                                    {user.username}
                                </td>
                                <td>{user.likeCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>}
            </main>
        </>
    );
};

export default LeaderboardPage;
