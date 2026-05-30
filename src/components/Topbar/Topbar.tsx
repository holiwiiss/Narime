import { Link, NavLink } from "react-router-dom";
import "./topbar.scss"
import MenuSetting from "../MenuSettings/MenuSetting";
import SearchAnimeComponent from "../SearchAnime/SearchAnimeComponent";
import { useAuth } from "../../context/authContext";
import { useUserData } from "../../hooks/useUserData";
import { useState } from "react";

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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white-50)" className="size-6 action-item__icon">
              <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
              <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
            </svg>
            <span className="text-p text-color--75 action-item__text">Home</span>
          </NavLink>

           <NavLink to='/discover' className={({ isActive }) => `action-item nav--option ${isActive ? "nav--option--active" : ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="var(--color-white-50)" className="size-5 action-item__icon">
              <path fillRule="evenodd" d="M2.5 3A1.5 1.5 0 0 0 1 4.5v4A1.5 1.5 0 0 0 2.5 10h6A1.5 1.5 0 0 0 10 8.5v-4A1.5 1.5 0 0 0 8.5 3h-6Zm11 2A1.5 1.5 0 0 0 12 6.5v7a1.5 1.5 0 0 0 1.5 1.5h4a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 17.5 5h-4Zm-10 7A1.5 1.5 0 0 0 2 13.5v2A1.5 1.5 0 0 0 3.5 17h6a1.5 1.5 0 0 0 1.5-1.5v-2A1.5 1.5 0 0 0 9.5 12h-6Z" clipRule="evenodd" />
            </svg>
            <span className="text-p text-color--75 action-item__text">Discover</span>
          </NavLink>

          {user && 
          <NavLink to='/my-list' className={({ isActive }) => `action-item nav--option ${isActive ? "nav--option--active" : ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white-50)" className="size-6 action-item__icon">
              <path fillRule="evenodd" d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 18.375V5.625Zm1.5 0v1.5c0 .207.168.375.375.375h1.5a.375.375 0 0 0 .375-.375v-1.5a.375.375 0 0 0-.375-.375h-1.5A.375.375 0 0 0 3 5.625Zm16.125-.375a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h1.5A.375.375 0 0 0 21 7.125v-1.5a.375.375 0 0 0-.375-.375h-1.5ZM21 9.375A.375.375 0 0 0 20.625 9h-1.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h1.5a.375.375 0 0 0 .375-.375v-1.5Zm0 3.75a.375.375 0 0 0-.375-.375h-1.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h1.5a.375.375 0 0 0 .375-.375v-1.5Zm0 3.75a.375.375 0 0 0-.375-.375h-1.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h1.5a.375.375 0 0 0 .375-.375v-1.5ZM4.875 18.75a.375.375 0 0 0 .375-.375v-1.5a.375.375 0 0 0-.375-.375h-1.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h1.5ZM3.375 15h1.5a.375.375 0 0 0 .375-.375v-1.5a.375.375 0 0 0-.375-.375h-1.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375Zm0-3.75h1.5a.375.375 0 0 0 .375-.375v-1.5A.375.375 0 0 0 4.875 9h-1.5A.375.375 0 0 0 3 9.375v1.5c0 .207.168.375.375.375Zm4.125 0a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5h-9Z" clipRule="evenodd" />
            </svg>
            <span className="text-p text-color--75 action-item__text">My List</span>
          </NavLink>}

          <div className="action-item nav--option">
            <div className={`nav--option-input  ${isSearchOpen ? 'input' : ''}`}>
              <div className="action-item nav--option" onClick={() => !isSearchOpen && setIsSearchOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white-50)" className="size-6 action-item__icon">
                  <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                </svg>
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