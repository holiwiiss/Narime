import { Link } from "react-router-dom";
import { useUserData } from "../../hooks/useUserData";
import { logOutFirebase } from "../../firebase/services/auth-service.firebase";
import "./menu-settings.scss"
import { useEffect, useRef } from "react";
import IconProfile from "../ui/icons/icon-profile";
import IconSettings from "../ui/icons/icon-settings";
import IconLogout from "../ui/icons/icon-logout";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const MenuSetting = ({ isOpen, onClose }: Props) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const {userData} = useUserData()

  useEffect(() => {
    
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const handleLogOut = () => {
    onClose();
    logOutFirebase()
  }

  return (
    <div className="surface menu-settings__container" ref={menuRef}>
      <div className="menu--settings--user-info">
        <div className="menu--settings-img-cont">
          <img className="icon-size-xl" src={userData?.avatar}></img>
        </div>
        <p className="text-p">{userData?.username}</p>
      </div>

      <Link className="text-btn text-color--75 action-item menu--settings--item" to="/user-page" onClick={() => onClose?.()}> 
        <IconProfile className="size-6 action-item__icon"/>
        Profile
      </Link>

      <Link className="text-btn text-color--75 action-item menu--settings--item" to="/settings-user" onClick={() => onClose?.()}> 
        <IconSettings className="size-6 action-item__icon"/>
        Settings
      </Link>

      <button className="text-btn text-color--75 action-item menu--settings--item" onClick={() => handleLogOut()}>
        <IconLogout className="size-6 action-item__icon"/>
        Sign out
      </button>
    </div>
    
  );
};

export default MenuSetting;
