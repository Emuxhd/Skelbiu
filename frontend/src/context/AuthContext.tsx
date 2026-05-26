import { createContext, useContext, useState, ReactNode } from "react"

interface AuthContextType {
  token: string | null
  role: string | null
  login: (token: string, role: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"))

  function login(token: string, role: string) {
    setToken(token)
    setRole(role)
    localStorage.setItem("token", token)
    localStorage.setItem("role", role)
  }

  function logout() {
    setToken(null)
    setRole(null)
    localStorage.removeItem("token")
    localStorage.removeItem("role")
  }

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}