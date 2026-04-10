import {Link, Outlet } from "react-router-dom"
import {Toaster } from "sileo";
import './App.css'

function App() {

  return (
    <>
    <Toaster position='top-right' />
      <div className="menu">
        <Link to='/'>Home</Link>
        <Link to='/directory'>Directorio</Link>
        <Link to='/register'>Registro</Link>
        <Link to='/login'>Login</Link>
      </div>
      <Outlet></Outlet>
    </>
  )
}

export default App
