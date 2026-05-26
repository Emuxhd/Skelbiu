import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Admin from "./pages/Admin"
import AdDetail from "./pages/AdDetail"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/skelbimai/:id" element={<AdDetail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App