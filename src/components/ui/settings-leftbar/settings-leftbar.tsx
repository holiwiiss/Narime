import { Link } from "react-router-dom"
import "./settings-leftbar.scss"

const SettingsLeftbar = () => {
  return(
    <nav className="settings-nav" aria-label="Settings navigation">
      <Link to="/user-page" className="text-details text-color--50 settings-nav--back">Go back</Link>

      <div role="group" aria-labelledby="section-profile" className="settings-nav__section">
        <p id="section-profile" className="text-p text-color--50">Profile</p>

        <button className="action-item settings-nav--item settings-nav--item-active">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white)" className="size-6 action-item__icon" aria-hidden="true">
            <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
          </svg>
          <span className="text-p text-color--75">Public Profile</span>
        </button>

        <button className="action-item settings-nav--item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--color-white)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-globe-icon lucide-globe action-item__icon">
            <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
          </svg>
          <span className="text-p text-color--75">Language</span>
        </button>

        <button className="action-item settings-nav--item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--color-white)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-palette-icon lucide-palette action-item__icon">
            <path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="var(--color-white)"/><circle cx="17.5" cy="10.5" r=".5" fill="var(--color-white)"/><circle cx="6.5" cy="12.5" r=".5" fill="var(--color-white)"/><circle cx="8.5" cy="7.5" r=".5" fill="var(--color-white)"/>
          </svg>
          <span className="text-p text-color--75">Aparence</span>
        </button>
      </div>

      <div role="group" aria-labelledby="section-security" className="settings-nav__section">
        <p id="section-security" className="text-p text-color--50">Security</p>

        <button className="action-item settings-nav--item">
          <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="var(--color-white)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-lock-icon lucide-lock action-item__icon">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span className="text-p text-color--75">Privacity</span>
        </button>

        <button className="action-item settings-nav--item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--color-white)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-key-round-icon lucide-key-round action-item__icon">
            <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="var(--color-white)"/>
          </svg>
          <span className="text-p text-color--75">Change Password</span>
        </button>
      </div>
    </nav>
  )
}

export default SettingsLeftbar