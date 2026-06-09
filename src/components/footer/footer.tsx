import { Link } from "react-router-dom"
import "./footer.scss"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__left">
        <div className="footer__logo">
          <p className="text-h1">Narime</p>
        </div>
        <div className="footer__info"> 
          <nav aria-label="Footer" className="footer-nav">
            <Link to="/directory" className="text-p footer-nav__item">Home</Link>
            <Link to="/discover" className="text-p footer-nav__item">Discover</Link>
            <Link to="" className="text-p footer-nav__item">Contact</Link>
            <Link to="/terms" className="text-p footer-nav__item">Terms</Link>
            <Link to="/terms" className="text-p footer-nav__item">Privacity</Link>
            <Link to="/terms" className="text-p footer-nav__item">Cookies</Link>
          </nav>
          <p className="text-p text-color--50">© 2026 Narime — Todos los derechos reservados</p>
        </div>
      </div>

      <div className="footer-social">
        <p className="text-p text-color--50">Support: narime@suport.com</p>
      </div>
    </footer>
  )
}

export default Footer