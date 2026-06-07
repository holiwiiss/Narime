import directoryImg from "../../../assets/images/directory.png"
import myListImg from "../../../assets/images/mylist.png"
import profileImg from "../../../assets/images/profile.png"
import "./landing.scss"
import { useState } from "react"
import IconUser from "../icons/icon-user"
import { Link } from "react-router-dom"

const Landing = () => {
  const [activeBtn, setActiveBtn] = useState<string>("directory")
  const [currentImage, setCurrentImage] = useState(directoryImg)
  
  return(
    <>
      <header className="landing-header">
        <div className="landing-header__text">
          <p className="text-p text-color--primary">- YOUR ANIME TRACK</p>
          <h1 className="text-h1 landing-header__title">YOUR ANIME. YOUR HISTORY. IN ONLY <span className=" text-h1 landing-header__title text-color--primary"> ONE PLACE </span></h1>
          <p className="text-p text-color--75">Keep track of everything you watch, organize your backlog, and discover <br/> new series without ever losing your pace</p>
        </div>

        <div className="landing-header__cta">
          <Link to="/register" className="btn btn--big text-btn">Start free</Link>
          <Link to="/directory" className="btn btn--big btn--secondary text-btn">Explore</Link>
        </div>

        <div className="landing-header__img"></div>
      </header>

      <main className="landing-main">

        <section className="landing-features">
          <header className="landing-section__header">
            <h2 className="text-h2">Features</h2>
            <p className="text-p text-color--75">Thousands of episodes, one single list. Keep your anime experience organized from start to finish.</p>
          </header>
          <div className="landing-features__content">
            <div className="landing-features__content--item">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--color-white)" className="size-6 icon-size-xl">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <h3 className="text-h3">Track your progress</h3>
              <p className="text-p">Mark episodes as watched, update statuses, and rate each anime as you go.</p>
            </div>
            <div className="landing-features__content--item">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--color-white)" className="size-6 icon-size-xl">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
              </svg>
              <h3 className="text-h3">Your list, organized</h3>
              <p className="text-p">Easily manage what you're watching, completed, dropped, or plan to watch.</p>
            </div>
            <div className="landing-features__content--item">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--color-white)" className="size-6 icon-size-xl">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
              <h3 className="text-h3">Discover your next anime</h3>
              <p className="text-p">Browse titles by season, popularity, rating, and find new stories to add to your list.</p>
            </div>
            <div className="landing-features__content--item">
              <IconUser fill="var(--color-white)" className="icon-size-xl"/>
              <h3 className="text-h3">Your fan profile</h3>
              <p className="text-p">Check your stats, favorites, and your full anime history all in one place.</p>
            </div>
          </div>
        </section>

        <section className="landing-screens">
          <header className="landing-section__header">
            <h2 className="text-h2">See narime in action</h2>
            <p className="text-p text-color--75">From discovering new anime to tracking your progress episode by episode, everything <br/> is designed so you enjoy every series more.</p>
          </header>
          <div className="landing-screens__content">
            <ul className="landing-screens--options">
              <li className={`landing-screens--options--item ${activeBtn === "directory" ? "landing--item-active" : ""}`} onClick={() => {setActiveBtn("directory") ; setCurrentImage(directoryImg)}}>
                <h3 className="text-h3">Directory</h3>
                <p className={`text-p text-color--75 ${activeBtn !== "directory" ? "visually-hidden" : ""}`}>Find anime by genre, season, or popularity and add your favorites in seconds.</p>
              </li>
              <li className={`landing-screens--options--item ${activeBtn === "mylist" ? "landing--item-active" : ""}`} onClick={() => {setActiveBtn("mylist"); setCurrentImage(myListImg)}}>
                <h3 className="text-h3">My List</h3>
                <p className={`text-p text-color--75 ${activeBtn !== "mylist" ? "visually-hidden" : ""}`}>Organize your personal collection and always keep your progress up to date.</p>
              </li>
              <li className={`landing-screens--options--item ${activeBtn === "profile" ? "landing--item-active" : ""}`} onClick={() => {setActiveBtn("profile"); setCurrentImage(profileImg)}}>
                <h3 className="text-h3">Profile</h3>
                <p className={`text-p text-color--75 ${activeBtn !== "profile" ? "visually-hidden" : ""}`}>View your stats, scores, and favorite series at a glance.</p>
              </li>
            </ul>
            <img src={currentImage} className="landing-screens__image"/>
          </div>
        </section>
      </main>
      <section className="landing-end">
          <h2 className="text-h1">Ready to take your anime to the next level?</h2>
          <p className="text-p text-color--75">No hassle. Start managing your list in under a minute. Begin building your history, discover <br/> new series, and keep all your progress perfectly organized.</p>
          <Link to="/register" className="btn btn--big">Get started for free</Link>
      </section>
    </>
  )
}

export default Landing