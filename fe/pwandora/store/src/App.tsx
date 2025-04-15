import { Route, Routes } from 'react-router'
import { ROUTES } from './consts/ROUTES'
import DefaultLayout from './layouts/DefaultLayout'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import MyAppsPage from './pages/MyAppsPage'
import AppDetailPage from './pages/AppDetailPage'
import AppsPage from './pages/AppsPage'
import AuthGuard from './components/auth/AuthGuard'
import GuestGuard from './components/auth/GuestGuard'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import { AuthProvider } from './contexts/AuthContext'
import TestPage from './pages/TestPage'

function App() {
  return (
    <AuthProvider>
      <div className='flex flex-col items-center ' style={{ height: '100vh' }}>
        <Routes>
          <Route path='/' element={<AuthGuard />}>
            <Route path='/' element={<DefaultLayout footer />}>
              <Route index element={<HomePage />} />
              <Route path={ROUTES.MY_APPS} element={<MyAppsPage />} />
            </Route>
            <Route path={ROUTES.TEST} element={<TestPage />} />

            <Route
              path='/'
              element={
                <DefaultLayout
                  header={{ backButton: true, searchButton: true }}
                />
              }
            >
              <Route path={ROUTES.APPS} element={<AppsPage />} />
            </Route>

            <Route
              path={ROUTES.SEARCH}
              element={<DefaultLayout header={{ searchBar: true }} footer />}
            >
              <Route index element={<SearchPage />} />
            </Route>

            <Route
              path={ROUTES.APP_DETAIL}
              element={
                <DefaultLayout
                  header={{ backButton: true, searchButton: true }}
                />
              }
            >
              <Route index element={<AppDetailPage />} />
            </Route>
          </Route>
          <Route path='/' element={<GuestGuard />}>
            <Route path={ROUTES.SIGNIN} element={<SignInPage />} />
            <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
