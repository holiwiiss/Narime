import directoryImg from "../../../assets/images/directory.png"
import myListImg from "../../../assets/images/mylist.png"
import profileImg from "../../../assets/images/profile.png"
import "./landing.scss"
import { useState } from "react"
import IconUser from "../icons/icon-user"

const Landing = () => {
  const [activeBtn, setActiveBtn] = useState<string>("directory")
  const [currentImage, setCurrentImage] = useState(directoryImg)
  
  return(
    <>
      <header className="landing-header">
        <div className="landing-header__text">
          <p className="text-p text-color--primary">- YOUR ANIME TRACK</p>
          <h1 className="text-h1 landing-header__title">YOUR ANIME. YOUR HISTORY. IN ONLY <span className=" text-h1 landing-header__title text-color--primary"> ONE PLACE </span></h1>
          <p className="text-p text-color--75">Lleva el control de todo lo que ves, organiza tus pendientes y descubre <br/>  nuevas series sin perder nunca el ritmo.</p>
        </div>

        <div className="landing-header__cta">
          <button className="btn btn--big">Start free</button>
          <button className="btn btn--big btn--secondary">Explore</button>
        </div>

        <div className="landing-header__img"></div>
      </header>

      <main className="landing-main">

        <section className="landing-features">
          <header className="landing-section__header">
            <h2 className="text-h2">Features</h2>
            <p className="text-p color-text--75">Miles de episodios, una sola lista. Mantén tu experiencia anime organizada de principio a fin.</p>
          </header>
          <div className="landing-features__content">
            <div className="landing-features__content--item">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--color-white)" className="size-6 icon-size-xl">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <h3 className="text-h3">Registra tu progreso</h3>
              <p>Marca episodios vistos, actualiza estados y puntúa cada anime mientras avanzas.</p>
            </div>
            <div className="landing-features__content--item">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--color-white)" className="size-6 icon-size-xl">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
              </svg>
              <h3 className="text-h3"> Tu lista, organizada</h3>
              <p>Gestiona fácilmente lo que estás viendo, completaste, abandonaste o planeas ver.</p>
            </div>
            <div className="landing-features__content--item">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--color-white)" className="size-6 icon-size-xl">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
              <h3 className="text-h3">Descubre tu próximo anime</h3>
              <p>Explora títulos por temporada, popularidad, valoración y encuentra nuevas historias para añadir a tu lista.</p>
            </div>
            <div className="landing-features__content--item">
              <IconUser fill="var(--color-white)" className="icon-size-xl"/>
              <h3 className="text-h3">Tu perfil de fan</h3>
              <p>Consulta estadísticas, favoritos y todo tu historial anime desde un único lugar.</p>
            </div>
          </div>
        </section>

        <section className="landing-screens">
          <header className="landing-section__header">
            <h2 className="text-h2">Ve narime en acción</h2>
            <p>Desde descubrir nuevos animes hasta seguir tu progreso episodio a episodio, todo está diseñado <br/> para que disfrutes más de cada serie.</p>
          </header>
          <div className="landing-screens__content">
            <ul className="landing-screens--options">
              <li className={`landing-screens--options--item ${activeBtn === "directory" ? "landing--item-active" : ""}`} onClick={() => {setActiveBtn("directory") ; setCurrentImage(directoryImg)}}>
                <h3 className="text-h3">Directory</h3>
                <p className={`text-p text-color--75 ${activeBtn !== "directory" ? "visually-hidden" : ""}`}>Encuentra animes por género, temporada o popularidad y añade tus favoritos en segundos.</p>
              </li>
              <li className={`landing-screens--options--item ${activeBtn === "mylist" ? "landing--item-active" : ""}`} onClick={() => {setActiveBtn("mylist"); setCurrentImage(myListImg)}}>
                <h3 className="text-h3">My List</h3>
                <p className={`text-p text-color--75 ${activeBtn !== "mylist" ? "visually-hidden" : ""}`}>Organiza tu colección personal y mantén siempre actualizado tu progreso.</p>
              </li>
              <li className={`landing-screens--options--item ${activeBtn === "profile" ? "landing--item-active" : ""}`} onClick={() => {setActiveBtn("profile"); setCurrentImage(profileImg)}}>
                <h3 className="text-h3">Profile</h3>
                <p className={`text-p text-color--75 ${activeBtn !== "profile" ? "visually-hidden" : ""}`}>Visualiza tus estadísticas, puntuaciones y series favoritas de un vistazo.</p>
              </li>
            </ul>
            <img src={currentImage} className="landing-screens__image"/>
          </div>
        </section>
      </main>
      <section className="landing-end">
          <h2 className="text-h1">¿Listo para llevar tu anime al siguiente nivel?</h2>
          <p className="text-p text-color--75">Sin complicaciones. Empieza a gestionar tu lista en menos de un minuto. Empieza a construir tu historial, <br/> descubre nuevas series y mantén toda tu progreso perfectamente organizado.</p>
          <button className="btn btn--big">Inicia Sesión gratis</button>
      </section>
    </>
  )
}

export default Landing