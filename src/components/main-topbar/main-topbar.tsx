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
            <IconHome className="size-6 action-item__icon"/>
            <span className="text-p text-color--75 action-item__text">Explore</span>
          </NavLink>

          <NavLink to='/discover' className={({ isActive }) => `action-item nav--option ${isActive ? "nav--option--active" : ""}`}>
            <IconDiscover className="size-6 action-item__icon"/>
            <span className="text-p text-color--75 action-item__text">Discover</span>
          </NavLink>

          {user && 
          <NavLink to='/my-list' className={({ isActive }) => `action-item nav--option ${isActive ? "nav--option--active" : ""}`}>
            <IconMylist className="size-6 action-item__icon"/>
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