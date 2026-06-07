import { Link } from "react-router-dom"
import "./footer.scss"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer--left">
        <div className="footer--logo">
          <h1 className="text-h1">Narime</h1>
        </div>
        <div className="footer--info"> 
          <nav className="footer-nav">
            <Link to="/directory" className="text-p footer-nav--item">Home</Link>
            <Link to="/discover" className="text-p footer-nav--item">Discover</Link>
            <Link to="" className="text-p footer-nav--item">Contact</Link>
            <Link to="/terms" className="text-p footer-nav--item">Terms</Link>
            <Link to="/terms" className="text-p footer-nav--item">Privacity</Link>
            <Link to="/terms" className="text-p footer-nav--item">Cookies</Link>
          </nav>
          <p className="text-p text-color--50">© 2026 Narime — Todos los derechos reservados</p>
        </div>
      </div>

      <div className="footer-social">
        <div className="footer-social--icons">

        </div>
        <p className="text-p text-color--50">Support: narime@suport.com</p>
      </div>
    </footer>
  )
}

export default Footer