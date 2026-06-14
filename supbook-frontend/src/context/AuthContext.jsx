import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children}) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null)
    const login = (jwt, userData) => {
        localStorage.setItem('token', jwt)
        localStorage.setItem('user', JSON.stringify(userData))
        setToken(jwt)
        setUser(userData)
    }
    const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
    
