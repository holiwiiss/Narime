import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import DirectoryPage from './view/directory/DirectoryPage.tsx'
import RegisterPage from './view/register/RegisterPage.tsx'
import LoginPage from './view/login/LoginPage.tsx'
import AnimePage from './view/animepage/AnimePage.tsx'

const router = createBrowserRouter([
  {
    path:'/',
    element:<App/>,
    children: [
      {
        index: true,
        element: <DirectoryPage/>
      },
      {
        path:'/directory',
        element: <DirectoryPage/>
      },
      {
        path:'/register',
        element: <RegisterPage/>
      },
      {
        path:'/login',
        element: <LoginPage/>
      },
      {
        path:'/anime/:id',
        element: <AnimePage/>
      },
      {
        path:'*',
        element: <div>Esta página no existe</div>
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />)
