import {Link, Outlet } from "react-router-dom"
import {Toaster } from "sileo";
import './App.scss'
import SearchAnimeComponent from "./components/search-anime/SearchAnimeComponent";

function App() {

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
      </div>
      <Outlet></Outlet>
    </>
  )
}

export default App
