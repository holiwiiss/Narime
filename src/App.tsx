import { Outlet } from "react-router-dom"
import {Toaster } from "sonner";
import './App.scss'

function App() {
  

  return (
    <>
      <Topbar></Topbar>
      <Outlet></Outlet>
      <Toaster position='bottom-center' theme="dark" richColors/>
    </>
  )
}

export default App
