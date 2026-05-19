import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserInformation } from "../../firebase/services/user-information.firebase";
import "./userPage.scss"

const UserPage = () => {

  const { user } = useAuth()
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    if(!user) return
    const fetchUser = async () => {
      const dataFirebase = await getUserInformation(user.uid);

      console.log(dataFirebase);

      if (dataFirebase) {
        console.log(dataFirebase.email);
        setUserData(dataFirebase);
      }
    };
    fetchUser();

  },[user]);

  return <>
    <h1>{userData.username}</h1>
    <img className="user__image" src={userData.avatar} alt="" />
  </>;
};

export default UserPage;
