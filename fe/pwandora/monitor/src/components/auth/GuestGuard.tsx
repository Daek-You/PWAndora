import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { ROUTES } from '../../consts/ROUTES'
import { useAuth } from '../../contexts/AuthContext'

function GuestGuard() {
  const route = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      console.log(user)
      route(ROUTES.DASHBOARD)
    }
  }, [user, route])

  if (!user) return <Outlet />
  else return null
}

export default GuestGuard
