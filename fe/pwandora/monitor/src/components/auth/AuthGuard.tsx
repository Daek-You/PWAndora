import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { useAuth } from '../../contexts/AuthContext'
import { ROUTES } from '../../consts/ROUTES'

function AuthGuard() {
  const route = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      route(ROUTES.LOGIN)
    }
  }, [user, route])

  if (user) return <Outlet />
  else return null
}

export default AuthGuard
