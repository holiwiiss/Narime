import { Outlet } from "react-router-dom"
import {Toaster } from "sonner";
import './App.scss'
import Topbar from "./components/main-topbar/main-topbar";
import Footer from "./components/footer/footer";
import ScrollToTop from "./components/scroll-to-top/scroll-to-top";

function App() {
  
  return (
    <>
      <Toaster position='bottom-center' theme="dark" richColors/>
      <ScrollToTop />
      <Topbar/>
      <main>  
        <Outlet/>
      </main>
      <Footer/>
    </>
  )
}

export default App
