import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/consts/ROUTES'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'

function GuestGuard() {
  const route = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      console.log(user)
      route(ROUTES.HOME)
    }
  }, [user, route])

  if (!user) return <Outlet />
  else return null
}

export default GuestGuard
