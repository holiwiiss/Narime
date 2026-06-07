import IconHome from "../icons/icon-home"
import "./landing.scss"

const Landing = () => {
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
              <IconHome className="icon-size-xl"/>
              <h3 className="text-h3">Registra tu progreso</h3>
              <p>Marca episodios vistos, actualiza estados y puntúa cada anime mientras avanzas.</p>
            </div>
            <div className="landing-features__content--item">
              <IconHome className="icon-size-xl"/>
              <h3 className="text-h3"> Tu lista, organizada</h3>
              <p>Gestiona fácilmente lo que estás viendo, completaste, abandonaste o planeas ver.</p>
            </div>
            <div className="landing-features__content--item">
              <IconHome className="icon-size-xl"/>
              <h3 className="text-h3">Descubre tu próximo anime</h3>
              <p>Explora títulos por temporada, popularidad, valoración y encuentra nuevas historias para añadir a tu lista.</p>
            </div>
            <div className="landing-features__content--item">
              <IconHome className="icon-size-xl"/>
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
              <li className="landing-screens--options--item">
                <h3 className="text-h3">Directory</h3>
                <p className="text-p text-color--75">Encuentra animes por género, temporada o popularidad y añade tus favoritos en segundos.</p>
              </li>
              <li className="landing-screens--options--item">
                <h3 className="text-h3">Search</h3>
                <p className="text-p text-color--75 visually-hidden">Encuentra animes por género, temporada o popularidad y añade tus favoritos en segundos.</p>
              </li>
              <li className="landing-screens--options--item">
                <h3 className="text-h3">Profile</h3>
                <p className="text-p text-color--75 visually-hidden">Encuentra animes por género, temporada o popularidad y añade tus favoritos en segundos.</p>
              </li>
            </ul>
            <img src="#" className="landing-screens__image" />
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