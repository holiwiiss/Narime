import { Link, NavLink } from "react-router-dom";
import "./main-topbar.scss"
import MenuSetting from "../menu-settings/menu-settings";
import SearchAnimeComponent from "../search-anime.scss/search-anime";
import { useAuth } from "../../context/auth-context";
import { useUserData } from "../../hooks/useUserData";
import { useState } from "react";
import IconHome from "../ui/icons/icon-home";
import IconDiscover from "../ui/icons/icon-discover";
import IconMylist from "../ui/icons/icon-myList";
import IconSearch from "../ui/icons/icon-search";

const Topbar = () => {
  const { user } = useAuth()
  const { userData } = useUserData()
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  return (
    <div className="topbar">
        <div className="topbar--max">
        <img src="#" className="topbar--logo" alt="logo narime"></img>

        <nav className="topbar--nav">
          <NavLink to='/' className={({ isActive }) => `action-item nav--option ${isActive ? "nav--option--active" : ""}`}>
            <IconHome className="size-6 action-item__icon"/>
            <span className="text-p text-color--75 action-item__text">Home</span>
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
                  <>
                    <span className="text-p text-color--75 action-item__text">Search</span>
                  </>
                  )}
              </div>

              <div className={`search-input-wrap ${isSearchOpen ? 'open' : ''}`}>
                <SearchAnimeComponent isOpen={isSearchOpen}  onClose={() => setIsSearchOpen(false)}  />
              </div>
            </div>
          </div>


        </nav>

        <div className="topbar--user-search">
        
        {userData ? (
          <>
            <button className="icon-user-profile" onClick={() => setIsOptionsOpen(true)}><img className="icon-size-xl user-avatar-img" src={userData.avatar} alt="user avatar"></img></button>
            {isOptionsOpen && <MenuSetting isOpen={isOptionsOpen} onClose={()=> setIsOptionsOpen(false)}/>}
          </>
        ): (
          <Link to="/login">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white-50)" className="size-6 icon-size-xl">
              <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
            </svg>
          </Link>
        )}
          
        </div>
        </div>
      </div>
  )
}
export default Topbar