import {Link, Outlet } from "react-router-dom"
import {Toaster } from "sileo";
import './App.scss'
import SearchAnimeComponent from "./components/search-anime/SearchAnimeComponent";
import { useAuth } from "./context/AuthContext";
import { logOutFirebase } from "./firebase/services/authService";

function App() {
  const { user } = useAuth()
  return (
    <>
    <Toaster position='top-right' />
      <div className="menu">
        <Link to='/'>Home</Link>
        <Link to='/directory'>Directorio</Link>
        <Link to='/my-list'>My List</Link>
        <Link to='/register'>Registro</Link>
        <Link to='/login'>Login</Link>
        <SearchAnimeComponent></SearchAnimeComponent>
        {user && (
          <>
          <p>{user.email}</p>
          <button type="button" onClick={() => logOutFirebase()}>Cerrar sesion</button>
          </>
        )
        }

      </div>
      <Outlet></Outlet>
    </>
  )
}

export default App
