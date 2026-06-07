import { createRoot } from 'react-dom/client'
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import DirectoryPage from './view/directory/directory.tsx'
import RegisterPage from './view/register/register.tsx'
import LoginPage from './view/login/login.tsx'
import AnimePage from './view/anime-information/anime-information.tsx'
import SearchResultsPage from './view/search-results/search-results.tsx'
import { MyListProvider } from './context/my-list-context.tsx'
import MyListPage from './view/my-list/my-list.tsx'
import { AuthProvider } from './context/auth-context.tsx'
import ProtectedRoute from './router/protected-route.tsx'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import UserPage from './view/user-profile/user-profile.tsx'
import DiscoverPage from './view/discover/discover.tsx'
import SettingsUSer from './view/settings-user/settings-user.tsx'
import Landing from './components/ui/landing/landing.tsx'
//import PublicRoute from './router/PublicRoute.tsx'

const router = createBrowserRouter([
  {
    path:'/',
    element:<App/>,
    children: [
      {
        index: true,
        element: <Landing/>
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
        // element: <PublicRoute> <RegisterPage /> </PublicRoute>
        element:  <RegisterPage />
      },
      {
        path:'/login',
        //element: <PublicRoute> <LoginPage /> </PublicRoute>
        element: <LoginPage />
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
        path:'/discover',
        element: <DiscoverPage/>
      },
      {
        path:'/settings-user',
        element: <ProtectedRoute><SettingsUSer/></ProtectedRoute>
      },
      {
        path:'/user-page',
        element: <ProtectedRoute><UserPage/></ProtectedRoute>
      },
      {
        path:'*',
        element: <div>This page doesnt exists</div>
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
