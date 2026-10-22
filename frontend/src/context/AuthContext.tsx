import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '../api/client'

type User = { id:number, username:string, email:string, first_name:string, last_name:string, phone:string }
type Ctx = { user: User|null, login:(tok:string, refresh:string, user:User)=>void, logout:()=>void, isAuth: boolean, refreshUser:()=>Promise<void> }

const AuthContext = createContext<Ctx>({} as any)

export const AuthProvider = ({children}:{children:ReactNode})=>{
  const [user, setUser] = useState<User|null>(()=>{
    const s=localStorage.getItem('user')
    return s? JSON.parse(s): null
  })
  const login=(tok:string, refresh:string, u:User)=>{
    localStorage.setItem('access_token', tok)
    localStorage.setItem('refresh_token', refresh)
    localStorage.setItem('user', JSON.stringify(u))
    setUser(u)
  }
  const logout=()=>{
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    setUser(null)
  }
  const refreshUser= async()=>{
    try{
      const {data}=await api.get('/auth/me/')
      setUser(data)
      localStorage.setItem('user', JSON.stringify(data))
    }catch{ logout() }
  }
  useEffect(()=>{ if(localStorage.getItem('access_token') && !user) refreshUser() },[])

  return <AuthContext.Provider value={{user, login, logout, isAuth: !!user, refreshUser}}>{children}</AuthContext.Provider>
}
export const useAuth=()=>useContext(AuthContext)
