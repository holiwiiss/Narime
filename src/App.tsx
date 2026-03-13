import { Routes, Route } from "react-router-dom"
import StyleGuide from "./view/styleguide/StyleGuide"
import LoginPage from "./view/login/LoginPage"
import RegisterPage from './view/register/RegisterPage'
import {Toaster } from "sileo";
import './App.css'
import DirectoryPage from "./view/directory/DirectoryPage";

function App() {

  return (
    <>
    <Toaster position='top-right' />
      <Routes>
        <Route path='/style-guide' element={<StyleGuide/>}/>
      </Routes>

      <Routes>
        <Route path='/login' element={<LoginPage/>}/>
      </Routes>

      <Routes>
        <Route path='/register' element={<RegisterPage/>}/>
      </Routes>

      <Routes>
        <Route path='/directory' element={<DirectoryPage/>}/>
      </Routes>
    </>
  )
}

export default App
