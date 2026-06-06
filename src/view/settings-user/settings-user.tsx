import { Navigate } from "react-router-dom"
import "./settings-user.scss"
import { useAuth } from "../../context/auth-context"
import { useUserData } from "../../hooks/use-user-data"
import { useState } from "react"
import { updateBiografi, updateUsername } from "../../firebase/services/user-information.firebase"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import LoadingComponent from "../../components/loading-component/loading-component"
import ErrorComponent from "../../components/error-component/error-component"
import SettingsLeftbar from "../../components/ui/settings-leftbar/settings-leftbar"

const SettingsUSer = () => {
  const queryClient = useQueryClient()

  const { user } = useAuth()
  const { isLoadingUser, isErrorUser, userData} = useUserData()
  
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>("")
  const [isEditingBio, setIsEditingBio] = useState<boolean>(false);
  const [newBiography, setNewBiography] = useState<string>("")

  const handleUpdateUserInfo = async (userId:string) =>{
    try{
      await updateUsername(userId, newUsername)
      await queryClient.invalidateQueries({ queryKey: ["userData"] })
      toast.success("Username updated")
      setIsEditingPersonalInfo(false)
    }catch{
      toast.error("Something went wrong")
    }
  }

  const handleUpdateUserBio = async (userId:string) =>{
    try{
      await updateBiografi(userId, newBiography)
      await queryClient.invalidateQueries({ queryKey: ["userData"] })
      toast.success("Biography updated")
      setIsEditingBio(false)
    }catch{
      toast.error("Something went wrong")
    }
  }

  if (!user) return <Navigate to="/login" replace />

  return (
    <>
      <div className="content-max settings-page">
      
        <SettingsLeftbar/>

        <div className="settings-panel">
          {isLoadingUser ? (
            <LoadingComponent/>
          ) : !isLoadingUser && isErrorUser ? (
            <ErrorComponent text="Something went wrong" button={{ label: "Try again", action:{ type: "reload" }}} />
          ) : (
            <>
              <header>
                <h1 className="text-h1">Edit Profile</h1>
              </header>
              
              <div className="settings-panel__section">
                <div className="user-setting-image">
                  <img src={userData?.avatar} alt="User avatar" className="settings-panel__avatar"></img>
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

                <div className="settings-panel__section">
                  <div className="user-setting-personal-info">
                    <div className="user-setting-personal-info--header">
                      <p className="text-p">Language</p>
                      <button className="btn btn--secondary">Edit</button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          
        </div>
      </div>
    </>
  )
}

export default SettingsUSer