import { Outlet } from "react-router-dom"
import {Toaster } from "sonner";
import './App.scss'
import Topbar from "./components/main-topbar/main-topbar";

function App() {
  
  return (
    <>
      <Topbar/>
      <Outlet/>
      <Toaster position='bottom-center' theme="dark" richColors/>
    </>
  )
}

export default App
