import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

export default function Admin() {
  const { token, role, loading } = useAuth()
  const navigate = useNavigate()
  
  const [ads, setAds] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [categoryName, setCategoryName] = useState("")

  const fetchAds = () => {
    if (!token) return
    fetch("http://localhost:3000/api/ads", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setAds(data) })
      .catch(console.error)
  }

  const fetchUsers = () => {
    if (!token) return
    fetch("http://localhost:3000/api/users", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setUsers(data) })
      .catch(console.error)
  }

  const fetchCategories = () => {
    fetch("http://localhost:3000/api/categories")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCategories(data) })
      .catch(console.error)
  }

  useEffect(() => {
    if (loading) return 
    if (!token || role !== "admin") {
      navigate("/")
      return
    }

    fetchAds()
    fetchUsers()
    fetchCategories()
  }, [token, role, loading, navigate])

  if (loading || !token || role !== "admin") {
    return <div className="text-center py-10 text-white bg-gray-800 min-h-screen">Tikrinama teises</div>
  }

  async function blockAd(id: number) {
    const res = await fetch(`http://localhost:3000/api/admin/ads/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) fetchAds()
  }

  async function blockUser(id: number) {
    const res = await fetch(`http://localhost:3000/api/admin/users/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) fetchUsers()
  }

  async function addCategory() {
    if (!categoryName.trim()) return
    const res = await fetch("http://localhost:3000/api/categories", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ name: categoryName })
    })
    
    if (res.ok) {
      setCategoryName("")
      fetchCategories()
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-800 py-6 px-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panele</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate("/")} 
            className="border-gray-900 text-gray-900 rounded-full px-5 hover:bg-gray-900 hover:text-white transition-colors"
          >
            Atgal
          </Button>
        </div>

        <Card className="mb-6 border-gray-200">
          <CardHeader className="p-4 bg-gray-50 border-b border-gray-100 rounded-t-xl">
            <CardTitle className="text-base font-semibold text-gray-900">Kategorijos</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="flex gap-2">
              <Input 
                placeholder="Kategorijos pavadinimas" 
                value={categoryName} 
                onChange={e => setCategoryName(e.target.value)} 
                className="border-gray-300 focus:border-yellow-400 focus:ring-yellow-400 rounded-md"
              />
              <Button onClick={addCategory} className="bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-medium rounded-md px-6">
                Prideti
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {categories.length === 0 ? (
                <p className="text-xs text-gray-400">Kategoriju nera.</p>
              ) : (
                categories.map((c: any) => (
                  <span key={c.id} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full border border-gray-200">
                    {c.name}
                  </span>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-gray-200">
          <CardHeader className="p-4 bg-gray-50 border-b border-gray-100 rounded-t-xl">
            <CardTitle className="text-base font-semibold text-gray-900">Skelbimai</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            {ads.length === 0 ? (
              <p className="text-sm text-gray-500 py-2">Skelbimu nera.</p>
            ) : (
              ads.map((ad: any) => (
                <div key={ad.id} className="flex justify-between items-center border-b border-gray-100 py-3 last:border-none">
                  <span className="text-sm text-gray-800 font-medium">{ad.title}</span>
                  <Button variant="destructive" size="sm" onClick={() => blockAd(ad.id)} className="rounded-full px-4 text-xs">
                    Pasalinti
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="p-4 bg-gray-50 border-b border-gray-100 rounded-t-xl">
            <CardTitle className="text-base font-semibold text-gray-900">Vartotojai</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            {users.length === 0 ? (
              <p className="text-sm text-gray-500 py-2">Vartotoju nera.</p>
            ) : (
              users.map((u: any) => (
                <div key={u.id} className="flex justify-between items-center border-b border-gray-100 py-3 last:border-none">
                  <span className="text-sm text-gray-800 font-medium">
                    {u.username} {u.blocked ? <span className="text-red-500 text-xs font-normal ml-1">(uzblokuotas)</span> : ""}
                  </span>
                  {!u.blocked && (
                    <Button variant="destructive" size="sm" onClick={() => blockUser(u.id)} className="rounded-full px-4 text-xs">
                      Blokuoti
                    </Button>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}