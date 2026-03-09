import { Routes, Route } from "react-router-dom"
import StyleGuide from "./view/styleguide/StyleGuide"
import Login from "./view/login/Login"
import Register from './view/register/Register'
import './App.css'

function App() {

  return (
    <>
      <Routes>
        <Route path="/style-guide" element={<StyleGuide/>}/>
      </Routes>

      <Routes>
        <Route path='/login' element={<Login/>}/>
      </Routes>

      <Routes>
        <Route path='/register' element={<Register/>}/>
      </Routes>
    </>
  )
}

export default App
