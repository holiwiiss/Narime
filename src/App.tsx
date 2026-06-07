import { Outlet } from "react-router-dom"
import {Toaster } from "sonner";
import './App.scss'
import Topbar from "./components/main-topbar/main-topbar";
import Footer from "./components/footer/footer";

function App() {
  
  return (
    <>
      <Topbar/>
      <Outlet/>
      <Toaster position='bottom-center' theme="dark" richColors/>
      <Footer/>
    </>
  )
}

export default App
