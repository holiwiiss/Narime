import { Link, NavLink } from "react-router-dom";
import "./main-topbar.scss"
import MenuSetting from "../menu-settings/menu-settings";
import SearchAnimeComponent from "../search-anime.scss/search-anime";
import { useUserData } from "../../hooks/use-user-data";
import { useState } from "react";
import IconHome from "../ui/icons/icon-home";
import IconDiscover from "../ui/icons/icon-discover";
import IconMylist from "../ui/icons/icon-my-list";
import IconSearch from "../ui/icons/icon-search";
import { useAuth } from "../../hooks/use-auth";
import IconUser from "../ui/icons/icon-user";
import narimeLogo from "../../assets/images/narime-logo.png"

const Topbar = () => {
  const { user } = useAuth()
  const { userData } = useUserData()
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  return (
    <div className="topbar">
      <div className="topbar--max">
        <Link to="/" className="topbar--logo">
          <img src={narimeLogo} className="topbar--logo-img icon-size-xxl" alt="logo narime"></img>
          <p className="text-h1 text-color--75 topbar--logo-txt">Narime</p>
        </Link>

        <nav className="topbar--nav">
          <NavLink to='/directory' className={({ isActive }) => `action-item nav--option ${isActive ? "nav--option--active" : ""}`}>
            <IconMylist className="size-6 action-item__icon"/>
            <span className="text-p text-color--75 action-item__text">Explore</span>
          </NavLink>

          <NavLink to='/discover' className={({ isActive }) => `action-item nav--option ${isActive ? "nav--option--active" : ""}`}>
            <IconDiscover className="size-6 action-item__icon"/>
            <span className="text-p text-color--75 action-item__text">Discover</span>
          </NavLink>

          {user && 
          <NavLink to='/my-list' className={({ isActive }) => `action-item nav--option ${isActive ? "nav--option--active" : ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white-50)" className="size-6 action-item__icon">
              <path fillRule="evenodd" d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 0 0 1.075.676L10 15.082l5.925 2.844A.75.75 0 0 0 17 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0 0 10 2Z" clipRule="evenodd" />
            </svg>
            <span className="text-p text-color--75 action-item__text">My List</span>
          </NavLink>}

          <div className="action-item nav--option">
            <div className={`nav--option-input  ${isSearchOpen ? 'input' : ''}`}>
              <div className="action-item nav--option" onClick={() => !isSearchOpen && setIsSearchOpen(true)}>
                <IconSearch className="size-6 action-item__icon"/>
                {!isSearchOpen && (
                  <span className="text-p text-color--75 action-item__text">Search</span>
                )}
                <SearchAnimeComponent isOpen={isSearchOpen}  onClose={() => setIsSearchOpen(false)}  />
              </div>
            </div>
          </div>
        </nav>

        <div className="topbar--user-search">
          {userData ? (
              <>
              <button onClick={() => setIsOptionsOpen(true)}><img className="icon-size-xxl icon-user-profile" src={userData.avatar} alt="user avatar"></img></button>
              {isOptionsOpen && <MenuSetting isOpen={isOptionsOpen} onClose={()=> setIsOptionsOpen(false)}/>}
            </>
          ) : (
            <Link to="/login">
              <IconUser className="size-6 icon-size-xl"/>
            </Link>
          )} 
        </div>
      </div>
    </div>
  )
}
export default Topbar