import { useState } from 'react'
import { createContext, useContext } from 'react'

export const AuthContext = createContext({
  user: null as IUser | null,
  setUser: (_userData: IUser) => {},
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export interface ICategoryProps {
  children: React.ReactNode
}

export interface IUser {
  userId: number
  loginId: string
}

export const AuthProvider = (props: ICategoryProps) => {
  const localUserData = localStorage.getItem('user')
  const [user, setUser] = useState(
    localUserData ? JSON.parse(localUserData) : null,
  )

  const setUserStorage = (userData: IUser) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, setUser: setUserStorage, logout }}>
      {props.children}
    </AuthContext.Provider>
  )
}
