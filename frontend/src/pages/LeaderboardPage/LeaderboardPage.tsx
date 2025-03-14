import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./LeaderboardPage.module.css"

const LeaderboardPage = () => {
    const [topList, setTopList] = useState([
        {
            "rank": 1,
            "profile": "../../images/img.png",
            "name": "gipsz.Jakab",
            "likes": 123132
        },
        {
            "rank": 2,
            "profile": "../../images/img.png",
            "name": "gipsz.Péter",
            "likes": 12313
        },
        {
            "rank": 3,
            "profile": "../../images/img.png",
            "name": "beton.Jakab",
            "likes": 123
        },{
            "rank": 4,
            "profile": "../../images/img.png",
            "name": "nagy árpád",
            "likes": 1
        },{
            "rank": 5,
            "profile": "../../images/img.png",
            "name": "Példa Péter",
            "likes": 0
        }
    ])
    return ( 
        <>
            <Navbar selectedPage={"leaderboard"}/>
            <main>
                <table className={styles.leaderboard}>
                    <thead>
                        <tr>
                            <td>Rank</td>
                            <td>Name</td>
                            <td>Likes</td>
                        </tr>
                    </thead>
                    <tbody>
                        {topList.map(user => {
                            return(
                                <tr>
                                    <td>{user.rank}</td>
                                    <td className={styles.nameContainer}><img src={user.profile}/>{user.name}</td>
                                    <td>{user.likes}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </main> 
        </>
    );
}
 
export default LeaderboardPage;