import { createRoot } from 'react-dom/client'
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import DirectoryPage from './view/directoryPage/DirectoryPage.tsx'
import RegisterPage from './view/register/RegisterPage.tsx'
import LoginPage from './view/login/LoginPage.tsx'
import AnimePage from './view/animePage/AnimePage.tsx'
import SearchResultsPage from './view/searchResultsPage/SearchResultsPage.tsx'
import { MyListProvider } from './context/MyListContext.tsx'
import MyListPage from './view/myListPage/MyListPage.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import ProtectedRoute from './router/ProtectedRoute.tsx'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

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
        loader: ({ request }) => {
          const url = new URL(request.url);
          if (!url.searchParams.get("category")) {
            return redirect("/directory?category=top");
          }
          return null;
        },
        element: <DirectoryPage/>
      },
      {
        path:'/my-list',
        element:  
        <ProtectedRoute>
          <MyListPage/>
        </ProtectedRoute>
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
        path:'/search/anime',
        element: <SearchResultsPage/>
      },
      {
        path:'*',
        element: <div>Esta página no existe</div>
      }
    ]
  }
])

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <MyListProvider>
        <RouterProvider router={router} />
      </MyListProvider>
    </AuthProvider>
  </QueryClientProvider>
)
