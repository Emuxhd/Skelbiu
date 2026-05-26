import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { login, register } from "../lib/api"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState("")
  const { login: authLogin } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit() {
    setError("")
    const res = isRegister
      ? await register(username, password)
      : await login(username, password)

    if (res.error) {
      setError(res.error)
      return
    }

    if (!isRegister) {
      authLogin(res.token, res.role)
      navigate("/")
    } else {
      setIsRegister(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 p-4">
      <Card className="w-full max-w-sm bg-white border border-gray-200 shadow-md rounded-xl overflow-hidden">
        <CardHeader className="bg-yellow-400 p-4 mb-4">
          <CardTitle className="text-xl font-bold text-gray-950 text-center">
            {isRegister ? "Registracija" : "Prisijungimas"}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex flex-col gap-4 p-5 pt-0">
          <div className="space-y-3">
            <Input 
              placeholder="Prisijungimo vardas" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              className="border-gray-300 focus:border-yellow-400 focus:ring-yellow-400 rounded-md"
            />
            <Input 
              placeholder="Slaptazodis" 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="border-gray-300 focus:border-yellow-400 focus:ring-yellow-400 rounded-md"
            />
          </div>

          {error && <p className="text-red-500 text-xs text-center font-medium">{error}</p>}
          
          <Button 
            onClick={handleSubmit} 
            className="w-full bg-gray-900 text-white rounded-full hover:bg-black transition-colors font-medium shadow-sm mt-2"
          >
            {isRegister ? "Registruotis" : "Prisijungti"}
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={() => {
              setIsRegister(!isRegister)
              setError("")
            }}
            className="text-xs text-gray-500 hover:text-gray-900 hover:bg-transparent transition-colors mt-1"
          >
            {isRegister ? "Prisijungti" : "Registruotis"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}