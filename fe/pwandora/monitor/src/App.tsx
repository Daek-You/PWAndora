import { Route, Routes, Navigate } from 'react-router'
import DefaultLayout from './layouts/DefaultLayout'
import { ROUTES } from './consts/ROUTES'
import * as Pages from './pages/index'
import AuthGuard from './components/auth/AuthGuard'
import GuestGuard from './components/auth/GuestGuard'
import LogDetail from './components/crawlerStatus/LogDetail'
import DefaultLogDetail from './components/crawlerStatus/DefaultLogDetail'

function App() {
  return (
    <div>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route element={<AuthGuard />}>
            <Route path={ROUTES.DASHBOARD} element={<Pages.DashBoardPage />} />
            <Route path={ROUTES.APP}>
              <Route index element={<Pages.AppListPage />} />
              <Route path=':appId' element={<Pages.AppDetailPage />} />
            </Route>
            <Route
              path={ROUTES.CONFIRMATION}
              element={<Pages.ConfirmationLandingPage />}
            />
            <Route
              path={ROUTES.CONFIRMATION_DETAIL}
              element={<Pages.ConfirmationPage />}
            />
            <Route
              path={ROUTES.CRAWLER_RUNNING}
              element={<Pages.CrawlerRunningPage />}
            ></Route>
            <Route
              path={ROUTES.CRAWLER_STATUS}
              element={<Pages.CrawlerStatusPage />}
            >
              <Route index element={<DefaultLogDetail />} />
              <Route path=':runId' element={<LogDetail />} />
            </Route>
          </Route>
          <Route element={<GuestGuard />}>
            <Route path={ROUTES.LOGIN} element={<Pages.LoginPage />} />
            <Route path={ROUTES.SIGNUP} element={<Pages.SignUpPage />} />
          </Route>
          <Route path='*' element={<Navigate to='/dashboard' replace />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
