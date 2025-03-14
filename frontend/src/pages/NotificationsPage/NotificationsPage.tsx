import {  useState } from "react"; 
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import Notification from "../../components/Notification/Notification";

const NotificationsPage = () => {
  const navigate = useNavigate() 
  const [profile, setProfile] = useState() 
  const notifications = [
    {user: "Gipsz Jakab", userPic: "../../images/img.png", actionType: 1, post: "../../images/img.png"},
    {user: "Beton Jakab", userPic: "../../images/img.png", actionType: 2, post: null}
  ]

  return (
    <>
      <Navbar selectedPage="notifications"/>
      <main>
        {notifications.map((notif, i) => {
            return <Notification notif={notif} key={i}/>
        })}
      </main>
    </>
  )
}

export default NotificationsPage