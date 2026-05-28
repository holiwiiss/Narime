import { Outlet } from "react-router-dom"
import {Toaster } from "sileo";
import './App.scss'
import Topbar from "./components/Topbar/Topbar";


function App() {
  

  return (
    <>
      <Toaster position='top-right' />
      <Topbar></Topbar>
      <Outlet></Outlet>
    </>
  )
}

export default App
