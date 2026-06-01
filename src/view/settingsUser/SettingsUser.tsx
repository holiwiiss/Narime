import { Link, Navigate } from "react-router-dom"
import "./settingsUser.scss"
import { useAuth } from "../../context/authContext"
import { useUserData } from "../../hooks/useUserData"
import { useState } from "react"
import { updateBiografi, updateUsername } from "../../firebase/services/user-information.firebase"
import { toast } from "sonner"

const SettingsUSer = () => {

  const { user } = useAuth()
  const { isLoadingUser, isErrorUser, userData} = useUserData()
  
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>("")
  const [isEditingBio, setIsEditingBio] = useState<boolean>(false);
  const [newBiography, setNewBiography] = useState<string>("")

  const handleUpdateUserInfo = (userId:string) =>{
    setIsEditingPersonalInfo(false)
    try{
      updateUsername(userId, newUsername)
      toast.success("Username updated")
    }catch{
      toast.error("Something went wrong")
    }
  }

  const handleUpdateUserBio = (userId:string) =>{
    setIsEditingBio(false)
    try{
      updateBiografi(userId, newBiography)
      toast.success("Biography updated")
    }catch{
      toast.error("Something went wrong")
    }
  }

  if (!user) return <Navigate to="/login" replace />

  return (
    <>
      <div className="all-content-max content-settings">
        
        <nav className="navigation-setting">

          <Link to="/user-page" className="text-details text-color--50">Go back</Link>

          <div className="navigation-settings--item">
            <p className="text-p text-color--50">Profile</p>
            <div className="action-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white)" className="size-6 action-item__icon">
                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
              </svg>
              <p className="text-p">Public Profile</p>
            </div>

            <div className="action-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white)" className="size-6 action-item__icon">
                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
              </svg>
              <p className="text-p">Language</p>
            </div>

            <div className="action-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white)" className="size-6 action-item__icon">
                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
              </svg>
              <p className="text-p">Aparence</p>
            </div>

          </div>

          <div className="navigation-settings--item">
            <p className="text-p text-color--50">Security</p>
            <div className="action-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white)" className="size-6 action-item__icon">
                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
              </svg>
              <p className="text-p">Privacity</p>
            </div>

            <div className="action-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white)" className="size-6 action-item__icon">
                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
              </svg>
              <p className="text-p">Change Password</p>
            </div>
          </div>

        </nav>

        <div className="content-settings">
          <h1 className="text-h1">Edit Profile</h1>
          <div className="user-information--settings">
            <div className="user-setting-image">
              <img src={userData?.avatar} className="image--settings"></img>
              <div className="user-settings--text">
                <button className="btn btn--secondary">Change image</button>
                <p className="text-p text-color--75">At least 800 x 800 px recommended.<br/>
                  JPG or PNG is allowes</p>
              </div>
            </div>

            <div className="user-settings-information">
              <div className="user-setting-personal-info">
                <div className="user-setting-personal-info--header">
                  <p className="text-p">Personal information</p>
                  {!isEditingPersonalInfo ? (<button className="btn btn--secondary" onClick={() => setIsEditingPersonalInfo(true)}>Edit</button>): (
                    <button className="text-p text-color--75" onClick={() => setIsEditingPersonalInfo(false)}> Close</button>
                  )}
                </div>
                <div className="user-setting-personal-info--content">
                  <div className="user-setting-personal-info--row">
                    <p className="text-details text-color--50">Username</p>
                    {!isEditingPersonalInfo ? (<p className="text-p text-color--75">{userData?.username}</p>
                    ) : (
                      <input type="text" className="text-p input" placeholder={userData?.username} onChange={(event) => setNewUsername(event.currentTarget.value)}></input>
                    )}
                  </div>
                  <div className="user-setting-personal-info--row">
                    <p className="text-details text-color--50">Email</p>
                    <p className="text-p text-color--75">{userData?.email}</p>
                  </div>
                </div>
                {isEditingPersonalInfo && (<button className="btn btn-save-settings" onClick={() => handleUpdateUserInfo(user.uid)}>Save changes</button> )}
              </div>

              <div className="user-setting-personal-info">
                <div className="user-setting-personal-info--header">
                  <p className="text-p">Biography</p>
                  {!isEditingBio ? (<button className="btn btn--secondary" onClick={() => setIsEditingBio(true)}>Edit</button>):(
                    <button className="text-p text-color--75" onClick={() => setIsEditingBio(false)}> Close</button>
                  )}
                </div>
                <div className="user-setting-personal-info--content">
                  {!isEditingBio ? (<p className="text-p text-color--75">{userData?.description}</p>
                  ):(
                    <textarea  className="text-p input biography-input" placeholder={userData?.description} onChange={(event) => setNewBiography(event.currentTarget.value)}></textarea>
                  )}
                </div>
                {isEditingBio && (<button className="btn btn-save-settings" onClick={() => handleUpdateUserBio(user.uid)}>Save changes</button>)}
              </div>
            </div>

            <div className="user-settings-information">
              <div className="user-setting-personal-info">
                <div className="user-setting-personal-info--header">
                  <p className="text-p">Language</p>
                  <button className="btn btn--secondary">Edit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SettingsUSer