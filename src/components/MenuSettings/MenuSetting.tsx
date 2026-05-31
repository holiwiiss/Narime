import { Link } from "react-router-dom";
import { useUserData } from "../../hooks/useUserData";
import { logOutFirebase } from "../../firebase/services/auth-service.firebase";
import "./menuSetting.scss"
import { useEffect, useRef } from "react";

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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white-50)" className="size-6 action-item__icon">
          <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
        </svg>
        Profile
      </Link>

      <Link className="text-btn text-color--75 action-item menu--settings--item" to="/settings-user" onClick={() => onClose?.()}> 
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white-50)" className="size-6 action-item__icon">
          <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
        </svg>
        Settings
      </Link>

      <button className="text-btn text-color--75 action-item menu--settings--item" onClick={() => handleLogOut()}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white-50)" className="size-6 action-item__icon">
          <path fillRule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z" clipRule="evenodd" />
        </svg>

        Sign out
      </button>
    </div>
    
  );
};

export default MenuSetting;
